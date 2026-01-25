const authService = require("../services/authService");
const userService = require("../services/userService");
const otpService = require("../services/otpService");
const googleAuthService = require("../services/googleAuthService");

class AuthController {
    async signup(name, email, phone, password, role = 'user') {
        if (!email && !phone) {
            throw new Error("Email or phone is required");
        }
        if (email && await userService.existsByEmail(email)) {
            throw new Error("Email already exists");
        }
        if (phone && await userService.existsByPhone(phone)) {
            throw new Error("Phone already exists");
        }

        const hashedPassword = await authService.hashPassword(password);
        const user = await userService.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role
        });
        const token = authService.generateToken(user._id);

        return { token, user };
    }

    async login(identifier, password, role) {
        if (!identifier) {
            throw new Error("Email or phone is required");
        }

        const user = await userService.findByIdentifier(identifier);
        if (!user) throw new Error("User not found");

        const isMatch = await authService.comparePassword(password, user.password);
        if (!isMatch) throw new Error("Incorrect password");

        if (role && user.role !== role) {
            throw new Error(`Please login via the ${user.role} portal.`);
        }

        const token = authService.generateToken(user._id);
        return { token, user };
    }

    async googleAuth(googleToken, role = 'user') {

        const googleUser = await googleAuthService.verifyToken(googleToken);


        let user = await userService.findByGoogleId(googleUser.googleId);

        if (!user) {

            if (googleUser.email) {
                const existingUser = await userService.findByEmail(googleUser.email);
                if (existingUser) {

                    user = await userService.updateProfile(existingUser._id, {
                        googleId: googleUser.googleId
                    });
                }
            }
        }

        if (!user) {

            user = await userService.create({
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.googleId,
                role,
                password: null
            });
        }

        const token = authService.generateToken(user._id);
        return { token, user };
    }

    async sendOTP(identifier) {
        if (!identifier) {
            throw new Error("Email or phone is required");
        }

        const user = await userService.findByIdentifier(identifier);
        if (!user) throw new Error("No account found with this email/phone");

        const otp = otpService.generate();
        const expiry = otpService.getExpiry();

        await userService.updateOTP(user._id, otp, expiry);


        const isEmail = identifier.includes('@');
        console.log(`OTP for ${identifier}: ${otp}`);

        return {
            success: true,
            message: `OTP sent to ${isEmail ? 'email' : 'phone'}`,
            otp
        };
    }

    async verifyOTP(identifier, otp) {
        const user = await userService.findByIdentifier(identifier);
        if (!user) throw new Error("User not found");

        if (!otpService.isValid(user.otp, user.otpExpiry, otp)) {
            throw new Error("Invalid or expired OTP");
        }

        return { success: true, message: "OTP verified" };
    }

    async resetPassword(identifier, otp, newPassword) {
        const user = await userService.findByIdentifier(identifier);
        if (!user) throw new Error("User not found");

        if (!otpService.isValid(user.otp, user.otpExpiry, otp)) {
            throw new Error("Invalid or expired OTP");
        }

        const hashedPassword = await authService.hashPassword(newPassword);
        await userService.updatePasswordById(user._id, hashedPassword);

        return { success: true, message: "Password reset successful" };
    }

    async getUserFromToken(token) {
        const decoded = authService.verifyToken(token);
        if (!decoded) return null;
        return userService.findById(decoded.userId);
    }

    async updateProfile(userId, email, phone) {
        if (email && await userService.existsByEmail(email)) {
            const existing = await userService.findByEmail(email);
            if (existing._id.toString() !== userId) {
                throw new Error("Email already in use");
            }
        }
        if (phone && await userService.existsByPhone(phone)) {
            const existing = await userService.findByPhone(phone);
            if (existing._id.toString() !== userId) {
                throw new Error("Phone already in use");
            }
        }

        return userService.updateProfile(userId, { email, phone });
    }
}

module.exports = new AuthController();

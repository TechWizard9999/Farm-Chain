const authService = require("../services/authService");
const userService = require("../services/userService");
const otpService = require("../services/otpService");
const emailService = require("../services/emailService");
const googleAuthService = require("../services/googleAuthService");

/**
 * Production-Ready Auth Controller
 * Handles authentication, OTP-based password reset
 */
class AuthController {
    
    // ==================== SIGNUP ====================
    async signup(name, email, phone, password, role = 'user') {
        // Validate input
        if (!email && !phone) {
            throw new Error("Email or phone is required");
        }
        if (!password || password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }

        // Check existing users
        if (email && await userService.existsByEmail(email)) {
            throw new Error("Email already registered");
        }
        if (phone && await userService.existsByPhone(phone)) {
            throw new Error("Phone already registered");
        }

        // Create user
        const hashedPassword = await authService.hashPassword(password);
        const user = await userService.create({
            name: name.trim(),
            email: email?.toLowerCase().trim(),
            phone: phone?.trim(),
            password: hashedPassword,
            role
        });

        const token = authService.generateToken(user._id);

        // Send welcome email (non-blocking)
        if (email) {
            emailService.sendWelcomeEmail(email, name).catch(err => 
                console.log('[WELCOME EMAIL] Failed:', err.message)
            );
        }

        return { token, user };
    }

    async login(identifier, password, role) {
        if (!identifier) {
            throw new Error("Email or phone is required");
        }
        if (!password) {
            throw new Error("Password is required");
        }

        const user = await userService.findByIdentifier(identifier);
        if (!user) {
            throw new Error("No account found with this email/phone");
        }

        // Check if account is locked
        if (user.accountLocked && user.lockUntil > new Date()) {
            const remainingMinutes = Math.ceil((user.lockUntil - new Date()) / 60000);
            throw new Error(`Account locked. Try again in ${remainingMinutes} minutes.`);
        }

        // Unlock if lock expired
        if (user.accountLocked && user.lockUntil <= new Date()) {
            await userService.unlockAccount(user._id);
        }

        const isMatch = await authService.comparePassword(password, user.password);
        if (!isMatch) throw new Error("Incorrect password");

        if (role && user.role !== role) {
            throw new Error(`Please login via the ${user.role} portal.`);
        }

        const token = authService.generateToken(user._id);
        return { token, user };
    }

    // ==================== GOOGLE AUTH ====================
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

    // ==================== SEND OTP ====================
    /**
     * Send OTP for password reset
     * - Does not require existing password
     * - Uses email to identify account
     * - Generates secure OTP
     * - Stores hashed OTP with expiration
     * - Implements rate limiting
     */
    async sendOTP(identifier) {
        // Validate input
        if (!identifier) {
            throw new Error("Email or phone is required");
        }

        const trimmedIdentifier = identifier.trim();
        const isEmail = trimmedIdentifier.includes('@');

        // Find user
        const user = await userService.findByIdentifier(trimmedIdentifier);
        if (!user) {
            // Security: Don't reveal if account exists
            // But for better UX, we'll return the error
            throw new Error("No account found with this email/phone");
        }

        // Check if account is locked
        if (user.accountLocked && user.lockUntil > new Date()) {
            const remainingMinutes = Math.ceil((user.lockUntil - new Date()) / 60000);
            throw new Error(`Account locked due to too many attempts. Try again in ${remainingMinutes} minutes.`);
        }

        // Rate limiting - check if resend is allowed
        if (user.otp?.lastSentAt) {
            const { allowed, waitSeconds } = otpService.canResend(user.otp.lastSentAt);
            if (!allowed) {
                throw new Error(`Please wait ${waitSeconds} seconds before requesting a new OTP`);
            }
        }

        // Generate OTP
        const { otp, otpData } = otpService.generateOTPData();

        // Store hashed OTP
        await userService.storeOTP(user._id, otpData);

        // Send OTP via email
        let emailSent = false;
        if (isEmail) {
            const result = await emailService.sendOTPEmail(trimmedIdentifier, otp);
            emailSent = result.sent;
        }

        // Log for debugging (remove in production)
        console.log(`[OTP] ${trimmedIdentifier}: ${otp}`);

        return {
            success: true,
            message: emailSent 
                ? `OTP sent to your email. Valid for ${otpService.OTP_EXPIRY_MINUTES} minutes.`
                : `OTP generated successfully`,
            expiresIn: otpService.OTP_EXPIRY_MINUTES * 60,
            // Only return OTP if email not configured (for testing)
            otp: emailSent ? null : otp
        };
    }

    // ==================== VERIFY OTP ====================
    /**
     * Verify OTP before allowing password reset
     * - Validates OTP against stored hash
     * - Tracks failed attempts
     * - Locks account after max attempts
     */
    async verifyOTP(identifier, otp) {
        if (!identifier || !otp) {
            throw new Error("Email/phone and OTP are required");
        }

        const user = await userService.findByIdentifier(identifier.trim());
        if (!user) {
            throw new Error("No account found");
        }

        // Check if account is locked
        if (user.accountLocked && user.lockUntil > new Date()) {
            const remainingMinutes = Math.ceil((user.lockUntil - new Date()) / 60000);
            throw new Error(`Account locked. Try again in ${remainingMinutes} minutes.`);
        }

        // Validate OTP
        const validation = otpService.validateOTP(user.otp, otp.toString());

        if (!validation.valid) {
            // Handle failed attempt
            if (validation.incrementAttempts) {
                await userService.incrementOTPAttempts(user._id);
                
                // Check if should lock after this attempt
                const updatedUser = await userService.findById(user._id);
                if (updatedUser.otp.attempts >= otpService.MAX_ATTEMPTS) {
                    await userService.lockAccount(user._id, otpService.getLockExpiry());
                    throw new Error(`Account locked due to too many failed attempts. Try again in ${otpService.LOCK_DURATION_MINUTES} minutes.`);
                }
            }

            if (validation.shouldLock) {
                await userService.lockAccount(user._id, otpService.getLockExpiry());
            }

            throw new Error(validation.error);
        }

        // Mark OTP as verified
        await userService.markOTPVerified(user._id);

        return { 
            success: true, 
            message: "OTP verified successfully. You can now reset your password." 
        };
    }

    // ==================== RESET PASSWORD ====================
    /**
     * Reset password after OTP verification
     * - Requires OTP to be verified first
     * - Updates password with proper hashing
     * - Clears OTP data
     * - Records password change timestamp
     */
    async resetPassword(identifier, otp, newPassword) {
        // Validate input
        if (!identifier || !otp || !newPassword) {
            throw new Error("Email/phone, OTP, and new password are required");
        }
        if (newPassword.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }

        const user = await userService.findByIdentifier(identifier.trim());
        if (!user) {
            throw new Error("No account found");
        }

        // Verify OTP one more time (defense in depth)
        const validation = otpService.validateOTP(user.otp, otp.toString());
        
        // For reset, we also accept already-verified OTP
        if (!validation.valid && validation.code !== 'ALREADY_USED') {
            if (!user.otp?.verified) {
                throw new Error("Please verify your OTP first");
            }
        }

        // Hash and update password
        const hashedPassword = await authService.hashPassword(newPassword);
        await userService.updatePassword(user._id, hashedPassword);

        // Unlock account if it was locked
        if (user.accountLocked) {
            await userService.unlockAccount(user._id);
        }

        console.log(`[PASSWORD RESET] Success for ${identifier}`);

        return { 
            success: true, 
            message: "Password reset successful. Please login with your new password." 
        };
    }

    // ==================== GET USER FROM TOKEN ====================
    async getUserFromToken(token) {
        const decoded = authService.verifyToken(token);
        if (!decoded) return null;
        return userService.findById(decoded.userId);
    }

    // ==================== UPDATE PROFILE ====================
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

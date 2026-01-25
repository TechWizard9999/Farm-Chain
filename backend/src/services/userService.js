const User = require("../models/user");

class UserService {
    async findByEmail(email) {
        return User.findOne({ email: email.toLowerCase().trim() });
    }

    async findByPhone(phone) {
        return User.findOne({ phone: phone.trim() });
    }

    async findByIdentifier(identifier) {
        const cleaned = identifier.trim();
        const isEmail = cleaned.includes('@');
        return isEmail 
            ? this.findByEmail(cleaned) 
            : this.findByPhone(cleaned);
    }

    async findById(id) {
        return User.findById(id);
    }

    async findByGoogleId(googleId) {
        return User.findOne({ googleId });
    }

    async create(userData) {
        const newUser = new User(userData);
        return newUser.save();
    }

    async existsByEmail(email) {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        return !!user;
    }

    async existsByPhone(phone) {
        const user = await User.findOne({ phone: phone.trim() });
        return !!user;
    }

    /**
     * Store OTP data for password reset
     * @param {string} userId - User ID
     * @param {object} otpData - { hash, expiresAt, attempts, lastSentAt, verified }
     */
    async storeOTP(userId, otpData) {
        return User.findByIdAndUpdate(
            userId,
            { otp: otpData },
            { new: true }
        );
    }

    /**
     * Increment OTP attempts after failed verification
     * @param {string} userId - User ID
     */
    async incrementOTPAttempts(userId) {
        return User.findByIdAndUpdate(
            userId,
            { $inc: { 'otp.attempts': 1 } },
            { new: true }
        );
    }

    /**
     * Mark OTP as verified
     * @param {string} userId - User ID
     */
    async markOTPVerified(userId) {
        return User.findByIdAndUpdate(
            userId,
            { 'otp.verified': true },
            { new: true }
        );
    }

    /**
     * Clear OTP data after password reset
     * @param {string} userId - User ID
     */
    async clearOTP(userId) {
        return User.findByIdAndUpdate(
            userId,
            { 
                otp: null,
                passwordChangedAt: new Date()
            },
            { new: true }
        );
    }

    /**
     * Lock user account
     * @param {string} userId - User ID
     * @param {Date} lockUntil - Lock expiry time
     */
    async lockAccount(userId, lockUntil) {
        return User.findByIdAndUpdate(
            userId,
            { 
                accountLocked: true, 
                lockUntil,
                otp: null  // Clear OTP on lock
            },
            { new: true }
        );
    }

    /**
     * Unlock user account
     * @param {string} userId - User ID
     */
    async unlockAccount(userId) {
        return User.findByIdAndUpdate(
            userId,
            { 
                accountLocked: false, 
                lockUntil: null 
            },
            { new: true }
        );
    }

    /**
     * Update user password
     * @param {string} userId - User ID
     * @param {string} hashedPassword - Hashed password
     */
    async updatePassword(userId, hashedPassword) {
        return User.findByIdAndUpdate(
            userId,
            { 
                password: hashedPassword,
                otp: null,
                passwordChangedAt: new Date()
            },
            { new: true }
        );
    }

    // Legacy method for backward compatibility
    async updateOTP(userId, otp, expiry) {
        return this.storeOTP(userId, {
            hash: otp,
            expiresAt: expiry,
            attempts: 0,
            lastSentAt: new Date(),
            verified: false
        });
    }

    // Legacy method for backward compatibility
    async updatePasswordById(userId, password) {
        return this.updatePassword(userId, password);
    }

    async updateProfile(userId, updates) {
        return User.findByIdAndUpdate(userId, updates, { new: true });
    }
}

module.exports = new UserService();

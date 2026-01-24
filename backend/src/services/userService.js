const User = require("../models/user");

class UserService {
    async findByEmail(email) {
        return User.findOne({ email });
    }

    async findByPhone(phone) {
        return User.findOne({ phone });
    }

    async findByIdentifier(identifier) {
        const isEmail = identifier.includes('@');
        return isEmail 
            ? this.findByEmail(identifier) 
            : this.findByPhone(identifier);
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
        const user = await User.findOne({ email });
        return !!user;
    }

    async existsByPhone(phone) {
        const user = await User.findOne({ phone });
        return !!user;
    }

    async updateOTP(userId, otp, expiry) {
        return User.findByIdAndUpdate(
            userId,
            { otp, otpExpiry: expiry },
            { new: true }
        );
    }

    async updatePasswordById(userId, password) {
        return User.findByIdAndUpdate(
            userId,
            { password, otp: null, otpExpiry: null },
            { new: true }
        );
    }

    async updateProfile(userId, updates) {
        return User.findByIdAndUpdate(userId, updates, { new: true });
    }
}

module.exports = new UserService();

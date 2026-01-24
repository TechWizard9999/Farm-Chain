const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
    constructor() {
        this.saltRounds = 10;
    }

    async hashPassword(password) {
        return bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    generateToken(userId) {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    }

    verifyToken(token) {
        try {
            if (!token) return null;
            const cleanToken = token.replace('Bearer ', '');
            return jwt.verify(cleanToken, process.env.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
}

module.exports = new AuthService();

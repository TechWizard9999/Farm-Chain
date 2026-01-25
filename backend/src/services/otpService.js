const crypto = require('crypto');

/**
 * Production-Ready OTP Service
 * Features:
 * - Secure 6-digit OTP generation using crypto
 * - OTP hashing for secure storage
 * - Configurable expiration time
 * - Rate limiting support
 * - Retry limit tracking
 */
class OTPService {
    constructor() {
        // Configuration
        this.OTP_LENGTH = 6;
        this.OTP_EXPIRY_MINUTES = 10;
        this.MAX_ATTEMPTS = 3;
        this.RESEND_COOLDOWN_SECONDS = 60;
        this.LOCK_DURATION_MINUTES = 30;
    }

    /**
     * Generate a cryptographically secure 6-digit OTP
     * @returns {string} 6-digit OTP
     */
    generate() {
        // Use crypto for secure random generation
        const buffer = crypto.randomBytes(4);
        const num = buffer.readUInt32BE(0);
        // Ensure 6 digits (100000 to 999999)
        const otp = (num % 900000) + 100000;
        return otp.toString();
    }

    /**
     * Hash OTP for secure storage
     * @param {string} otp - Plain text OTP
     * @returns {string} Hashed OTP
     */
    hash(otp) {
        return crypto
            .createHash('sha256')
            .update(otp.toString())
            .digest('hex');
    }

    /**
     * Verify OTP against stored hash
     * @param {string} inputOTP - User provided OTP
     * @param {string} storedHash - Stored hashed OTP
     * @returns {boolean} Whether OTP matches
     */
    verify(inputOTP, storedHash) {
        if (!inputOTP || !storedHash) return false;
        const inputHash = this.hash(inputOTP.toString());
        return crypto.timingSafeEqual(
            Buffer.from(inputHash),
            Buffer.from(storedHash)
        );
    }

    /**
     * Get OTP expiry timestamp
     * @returns {Date} Expiry date
     */
    getExpiry() {
        return new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);
    }

    /**
     * Check if OTP has expired
     * @param {Date} expiryDate - Stored expiry date
     * @returns {boolean} Whether OTP has expired
     */
    isExpired(expiryDate) {
        if (!expiryDate) return true;
        return new Date() > new Date(expiryDate);
    }

    /**
     * Check if resend is allowed (rate limiting)
     * @param {Date} lastSentAt - When last OTP was sent
     * @returns {object} { allowed: boolean, waitSeconds: number }
     */
    canResend(lastSentAt) {
        if (!lastSentAt) return { allowed: true, waitSeconds: 0 };
        
        const elapsed = (Date.now() - new Date(lastSentAt).getTime()) / 1000;
        const remaining = Math.ceil(this.RESEND_COOLDOWN_SECONDS - elapsed);
        
        return {
            allowed: elapsed >= this.RESEND_COOLDOWN_SECONDS,
            waitSeconds: remaining > 0 ? remaining : 0
        };
    }

    /**
     * Check if max attempts exceeded
     * @param {number} attempts - Current attempt count
     * @returns {boolean} Whether max attempts exceeded
     */
    maxAttemptsExceeded(attempts) {
        return attempts >= this.MAX_ATTEMPTS;
    }

    /**
     * Get account lock expiry time
     * @returns {Date} Lock expiry date
     */
    getLockExpiry() {
        return new Date(Date.now() + this.LOCK_DURATION_MINUTES * 60 * 1000);
    }

    /**
     * Generate OTP data object for storage
     * @returns {object} { otp, otpData } - Plain OTP and data to store
     */
    generateOTPData() {
        const otp = this.generate();
        const otpData = {
            hash: this.hash(otp),
            expiresAt: this.getExpiry(),
            attempts: 0,
            lastSentAt: new Date(),
            verified: false
        };
        return { otp, otpData };
    }

    /**
     * Validate OTP with full checks
     * @param {object} storedOTP - Stored OTP object from DB
     * @param {string} inputOTP - User provided OTP
     * @returns {object} { valid, error, shouldLock }
     */
    validateOTP(storedOTP, inputOTP) {
        // Check if OTP exists
        if (!storedOTP || !storedOTP.hash) {
            return { 
                valid: false, 
                error: 'No OTP request found. Please request a new OTP.',
                code: 'NO_OTP'
            };
        }

        // Check if already verified
        if (storedOTP.verified) {
            return { 
                valid: false, 
                error: 'OTP already used. Please request a new one.',
                code: 'ALREADY_USED'
            };
        }

        // Check expiration
        if (this.isExpired(storedOTP.expiresAt)) {
            return { 
                valid: false, 
                error: 'OTP has expired. Please request a new one.',
                code: 'EXPIRED'
            };
        }

        // Check max attempts
        if (this.maxAttemptsExceeded(storedOTP.attempts)) {
            return { 
                valid: false, 
                error: 'Too many failed attempts. Please request a new OTP.',
                code: 'MAX_ATTEMPTS',
                shouldLock: true
            };
        }

        // Verify OTP
        const isValid = this.verify(inputOTP, storedOTP.hash);
        
        if (!isValid) {
            const remainingAttempts = this.MAX_ATTEMPTS - storedOTP.attempts - 1;
            return { 
                valid: false, 
                error: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
                code: 'INVALID',
                incrementAttempts: true
            };
        }

        return { valid: true };
    }
}

module.exports = new OTPService();

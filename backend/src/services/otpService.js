class OTPService {
    generate() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    getExpiry() {
        return new Date(Date.now() + 10 * 60 * 1000);
    }

    isValid(storedOTP, storedExpiry, inputOTP) {
        if (!storedOTP || !storedExpiry) return false;
        if (new Date() > storedExpiry) return false;
        return storedOTP === inputOTP;
    }
}

module.exports = new OTPService();

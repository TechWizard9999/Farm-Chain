const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
        phone: { type: String, unique: true, sparse: true, trim: true },
        password: { type: String },
        role: {
            type: String,
            enum: ["farmer", "user", "consumer"],
            default: "user",
        },
        googleId: { type: String, unique: true, sparse: true },
        
        // OTP fields for password reset
        otp: { 
            hash: { type: String },           // Hashed OTP for security
            expiresAt: { type: Date },        // When OTP expires
            attempts: { type: Number, default: 0 },  // Failed verification attempts
            lastSentAt: { type: Date },       // Rate limiting - when last OTP was sent
            verified: { type: Boolean, default: false }  // Whether OTP has been verified
        },
        
        // Account security
        passwordResetToken: { type: String },  // Optional: for additional security
        passwordChangedAt: { type: Date },     // Track when password was last changed
        accountLocked: { type: Boolean, default: false },
        lockUntil: { type: Date }
    },
    { timestamps: true }
);

// Index for faster lookups
<<<<<<< Updated upstream

=======
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
>>>>>>> Stashed changes
userSchema.index({ 'otp.expiresAt': 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-cleanup

// Virtual to check if account is currently locked
userSchema.virtual('isLocked').get(function() {
    return this.accountLocked && this.lockUntil && this.lockUntil > new Date();
});

module.exports = mongoose.model("User", userSchema);

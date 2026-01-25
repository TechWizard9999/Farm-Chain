const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initTransporter();
    }

    initTransporter() {
        // Configure transporter based on environment variables
        // Supports Gmail, SMTP, or any other email provider
        if (process.env.EMAIL_SERVICE === 'gmail') {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS // Use App Password for Gmail
                }
            });
        } else if (process.env.SMTP_HOST) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        }
    }

    async sendOTPEmail(to, otp) {
        // If no transporter configured, log and return false
        if (!this.transporter) {
            console.log(`[EMAIL NOT CONFIGURED] OTP for ${to}: ${otp}`);
            return { sent: false, reason: 'Email not configured' };
        }

        const mailOptions = {
            from: `"FarmChain" <${process.env.EMAIL_USER || 'noreply@farmchain.com'}>`,
            to: to,
            subject: 'FarmChain - Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #10b981; margin: 0;">🌱 FarmChain</h1>
                        <p style="color: #64748b; margin-top: 5px;">Blockchain-Powered Agricultural Supply Chain</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; padding: 30px; text-align: center; margin-bottom: 20px;">
                        <h2 style="color: white; margin: 0 0 10px 0;">Your OTP Code</h2>
                        <div style="background: white; border-radius: 12px; padding: 20px; display: inline-block;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10b981;">${otp}</span>
                        </div>
                    </div>
                    
                    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                        <p style="color: #475569; margin: 0 0 10px 0;"><strong>⏰ This OTP expires in 10 minutes</strong></p>
                        <p style="color: #64748b; margin: 0; font-size: 14px;">
                            Use this code to reset your password. If you didn't request this, please ignore this email.
                        </p>
                    </div>
                    
                    <div style="text-align: center; color: #94a3b8; font-size: 12px;">
                        <p>This is an automated message from FarmChain.</p>
                        <p>Please do not reply to this email.</p>
                    </div>
                </div>
            `
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            console.log(`[EMAIL SENT] OTP sent to ${to}`);
            return { sent: true, messageId: result.messageId };
        } catch (error) {
            console.error(`[EMAIL ERROR] Failed to send OTP to ${to}:`, error.message);
            return { sent: false, reason: error.message };
        }
    }

    async sendWelcomeEmail(to, name) {
        if (!this.transporter) {
            console.log(`[EMAIL NOT CONFIGURED] Welcome email for ${to}`);
            return { sent: false, reason: 'Email not configured' };
        }

        const mailOptions = {
            from: `"FarmChain" <${process.env.EMAIL_USER || 'noreply@farmchain.com'}>`,
            to: to,
            subject: 'Welcome to FarmChain! 🌱',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #10b981; margin: 0;">🌱 FarmChain</h1>
                    </div>
                    
                    <h2 style="color: #1e293b;">Welcome, ${name}!</h2>
                    <p style="color: #475569;">
                        Thank you for joining FarmChain - the blockchain-powered agricultural supply chain platform.
                    </p>
                    <p style="color: #475569;">
                        You can now track your farm products with complete transparency and traceability.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/farmer/dashboard" 
                           style="background: #10b981; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                            Go to Dashboard
                        </a>
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return { sent: true };
        } catch (error) {
            console.error(`[EMAIL ERROR] Welcome email failed:`, error.message);
            return { sent: false, reason: error.message };
        }
    }
}

module.exports = new EmailService();

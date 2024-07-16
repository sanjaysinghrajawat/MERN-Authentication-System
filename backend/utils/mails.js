exports.generateOTP = () => {
    let otp = '';
    for (let i = 0; i <= 3; i++) {
        const randval = Math.round(Math.random() * 9)
        otp = otp + randval;
    }
    return otp;
}

const nodemailer = require('nodemailer')
exports.mailTransport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kiana.fahey@ethereal.email',
        pass: 'RFEE8Akg1ReMUCcawk'
    }
});

exports.emailTemplate = (otp, verificationLink) => {
    return `
        <h1>Verify your email</h1>
        <p>Use the following OTP to verify your email: <strong>${otp}</strong></p>
        <p>Or click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
    `;
};

exports.successfulMailTemplate = (name) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification Success</title>
    <style>
        /* Include the CSS inline for email compatibility */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            padding: 10px;
            text-align: center;
            color: white;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 10px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            font-size: 16px;
            color: white;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification Successful!</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>We are thrilled to inform you that your email address, [Recipient’s Email], has been successfully verified.</p>
            <p>Thank you for taking the time to complete this important step. You can now enjoy all the features and benefits our platform has to offer. If you have any questions or need assistance, please do not hesitate to contact our support team at <a href="mailto:[Support Email]">[Support Email]</a> or visit our <a href="[Link to Help Center]">Help Center</a>.</p>
            <p>Stay tuned for updates and new features by following us on social media:</p>
            <p>
                <a href="[Link to Facebook]" class="button">Facebook</a>
                <a href="[Link to Twitter]" class="button">Twitter</a>
                <a href="[Link to LinkedIn]" class="button">LinkedIn</a>
            </p>
            <p>Welcome aboard, and we look forward to serving you!</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>[Your Name]</p>
        </div>
    </div>
</body>
</html>
`
}

exports.passwordReserTemplate = (name, url) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        /* Include the CSS inline for email compatibility */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            padding: 10px;
            text-align: center;
            color: white;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 10px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            font-size: 16px;
            color: white;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>We received a request to reset the password for your account associated with [Recipient’s Email]. If you made this request, please click the button below to reset your password:</p>
            <p style="text-align: center;">
                <a href="${url}" class="button">Reset Password</a>
            </p>
            <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>If you have any questions or need further assistance, please contact our support team at <a href="mailto:[Support Email]">[Support Email]</a> or visit our <a href="[Link to Help Center]">Help Center</a>.</p>
            <p>Thank you,</p>
            <p>The [Your Company] Team</p>
        </div>
        <div class="footer">
            <p>[Your Company’s Contact Information]</p>
            <p><a href="[Company’s Website]">[Company’s Website]</a></p>
        </div>
    </div>
</body>
</html>
`
}
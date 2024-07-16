const User = require('../model/user')
const jwt = require("jsonwebtoken")
const VerificationToken = require("../model/verificationToken")
const { generateOTP, mailTransport, emailTemplate, successfulMailTemplate, passwordReserTemplate } = require('../utils/mails')
const { isValidObjectId } = require('mongoose')
const ResetToken = require('../model/resetToken')
const crypto = require('crypto')
const { createRandomBytes } = require('../utils/helper')

exports.userCreate = async (req, res) => {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email: email })
    if (userExist) {
        return res.status(400).json({
            success: false,
            error: "This is email is already Exist",
        });
    }
    const newUser = new User({
        name: name,
        email: email,
        password: password,
    })
    const OTP = generateOTP();
    const verificationToken = new VerificationToken({
        owner: newUser._id,
        token: OTP,
    })
    await verificationToken.save();
    await newUser.save();
    await mailTransport.sendMail({
        from: 'sanjaysinghrajawat77@gmail.com',
        to: newUser.email,
        subject: "Verify your email account",
        html: emailTemplate(OTP, `http://localhost:3000/verify-email?userId=${newUser._id}`),
    })
    return res.status(201).json({
        success: true,
        user: { name: newUser.name, email: newUser.email, id: newUser._id, verified: newUser.verified }
    });
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(401).json({
            success: false,
            error: "User not found"
        });
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
        return res.status(401).json({
            success: false,
            error: "Incorrect password"
        });
    }
    if (!user.verified) {
        return res.status(401).json({
            success: false,
            error: "Email not verified. Please verify your email."
        });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            token: token,
        }
    });
}


exports.verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.status(401).json({
            success: false,
            error: "Invalid request!!! Missing Parameters",
        })
    }
    if (!isValidObjectId(userId)) {
        return res.status(401).json({
            success: false,
            error: "Invalid User ID",
        })
    }
    const user = await User.findById(userId);

    if (!user) {
        return res.status(401).json({
            success: false,
            error: "User not found!!!",
        })
    }
    if (user.verified) {
        return res.status(401).json({
            success: false,
            error: "This Account is already Verify"
        })
    }
    const token = await VerificationToken.findOne({ owner: user._id })

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "User not found"
        })
    }

    const isMatched = await token.compareToken(otp)
    if (!isMatched) {
        return res.status(401).json({
            success: false,
            error: "Please provide a valid OTP"
        })
    }

    user.verified = true;
    await VerificationToken.findByIdAndDelete(token._id)
    await user.save()

    await mailTransport.sendMail({
        from: 'sanjaysinghrajawat77@gmail.com',
        to: user.email,
        subject: "Verify your email account",
        html: successfulMailTemplate(user.name),
    })

    return res.status(201).json({
        success: true,
        message: "Verification successfully"
    })
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(401).json({
            success: false,
            error: "Please provide valid email"
        })
    }

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).json({
            success: false,
            error: "User not found, Invalid request"
        })
    }

    const token = await ResetToken.findOne({ owner: user._id })
    if (token) {
        return res.status(401).json({
            success: false,
            error: "Only after an one hour you can request for another token"
        })
    }

    // generate random token from helper && convert sync into async
    const randomToken = await createRandomBytes();
    const resetToken = new ResetToken({
        owner: user._id,
        token: randomToken
    })
    await resetToken.save();
    await mailTransport.sendMail({
        from: 'sanjaysinghrajawat77@gmail.com',
        to: user.email,
        subject: "Password Reset",
        html: passwordReserTemplate(user.name, `http://localhost:3000/reset-password?token=${randomToken}&id=${user._id}`),
    })

    return res.status(200).json({
        success: true,
        message: "Password reset link is sent to your email"
    })
}

exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        const isSamePassword = await user.comparePassword(password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                error: "New password is the same as the old password",
            });
        }

        if (password.trim().length < 8 || password.trim().length > 20) {
            return res.status(400).json({
                success: false,
                error: "Password must be 8 to 20 characters long",
            });
        }

        user.password = password.trim();
        await user.save();

        await ResetToken.findOneAndDelete({ owner: user._id });

        await mailTransport.sendMail({
            from: 'sanjaysinghrajawat77@gmail.com',
            to: user.email,
            subject: "Password Reset Successfully",
            html: `<h1>Password Reset Successfully</h1>`,
        });

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

const { isValidObjectId } = require("mongoose");
const User = require("../model/user");
const ResetToken = require('../model/resetToken')

exports.isResetTokenValid = async (req, res, next) => {
    const { token, id } = req.query;
    if (!token || !id) {
        return res.status(401).json({
            success: false,
            error: "Invalide Request!"
        })
    }

    if (!isValidObjectId(id)) {
        return res.status(401).json({
            success: false,
            error: "Invalide User!"
        })
    }

    const user = await User.findById(id)
    if (!user) {
        return res.status(401).json({
            success: false,
            error: "User not found!"
        })
    }

    const resetToken = await ResetToken.findOne({ owner: user._id })
    if (!resetToken) {
        return res.status(401).json({
            success: false,
            error: "Reset Token not found!"
        })
    }

    const isValid = await resetToken.compareToken(token)
    if (!isValid) {
        return res.status(401).json({
            success: false,
            error: "Reset Token not found"
        })
    }

    req.user = user;
    next();
}
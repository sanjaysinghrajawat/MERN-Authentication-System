const { check, validationResult } = require('express-validator');

exports.validateUser = [
    check('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage("Name is Missing")
        .isLength({ min: 3, max: 20 })
        .withMessage("Name must be 3 to 20 charactor long"),

    check('email')
        .normalizeEmail()
        .isEmail()
        .withMessage("Email is Invalid"),

    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password must required")
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be 6 to 8 charactor long")
]

exports.ValidationResult = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length) {
        return res.status(400).json({
            success: false,
            error: error[0].msg
        });
    }
    next();
}
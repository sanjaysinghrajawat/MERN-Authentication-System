const { userCreate, login, verifyEmail, forgotPassword, resetPassword } = require('../controllers/user');
const { isResetTokenValid } = require('../middlewares/resetToken');
const router = require('express').Router();
const { validateUser, ValidationResult } = require('../middlewares/validate');

router.post('/register', validateUser, ValidationResult, userCreate)
router.post('/login', login)
router.post('/verify', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', isResetTokenValid, resetPassword)
router.get('/verify-token', isResetTokenValid, (req, res) => {
    return res.status(200).json({
        success: true
    })
})

module.exports = router;

exports.loginRequest = (req, res, next) => {
    const { email, password } = req.body;
    if (!email.trim() || !password.trim()) {
        return res.status(401).json({
            success: false,
            error: "Email and Passord Missing"
        })
    }
    next();
}
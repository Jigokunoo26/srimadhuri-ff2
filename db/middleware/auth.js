function requireAuth(req, res, next) {
    if (req.session && req.session.adminId) {
        return next();
    }
    // If not authenticated, redirect to login
    res.redirect('/admin/login');
}

function redirectIfAuth(req, res, next) {
    if (req.session && req.session.adminId) {
        return res.redirect('/admin');
    }
    next();
}

module.exports = {
    requireAuth,
    redirectIfAuth
};

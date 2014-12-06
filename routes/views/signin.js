var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res, next) {

    if (req.user) {
        return res.redirect(req.cookies.target || '/me');
    }

    if (!req.body.email || !req.body.password) {
        req.flash('error', 'Please enter your username and password.');
        return next();
    }

    var onSuccess = function() {
        res.send({success: true});
    };

    var onFail = function() {
        req.flash('error', 'Your username or password were incorrect, please try again.');
        return next();
    };

    keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);

};
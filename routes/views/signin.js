var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res, next) {

    if (req.user) {
        return res.redirect(req.cookies.target || '/me');
    }

    if (!req.body.email || !req.body.password) {
//        req.flash('error', 'Please enter your username and password.');
        res.send({success: false, error: 'Veuillez saisir votre email et votre mot de passe.'});
        return;
    }

    var onSuccess = function() {
        res.send({success: true});
    };

    var onFail = function() {
        res.send({success: false, error: 'Votre email ou votre mot de passe sont incorrects, veuillez réessayer.'});
        return;
    };

    keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);

};
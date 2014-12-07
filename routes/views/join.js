var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res, next) {

    async.series([

        function(cb) {

            if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
                req.flash('error', 'Please enter a name, email and password.');
                return cb(true);
            }

        return cb();

        },

        function(cb) {

            keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {

                if (err || user) {
                    req.flash('error', 'User already exists with that email address.');
                    return cb(true);
                }

                return cb();

            });

        },

        function(cb) {

            var userData = {
                name: {
                    first: req.body.firstname,
                    last: req.body.lastname,
                },
                email: req.body.email,
                password: req.body.password,

                website: req.body.website
            };

            var User = keystone.list('User').model,
                newUser = new User(userData);

            newUser.save(function(err) {
                return cb(err);
            });

        }

    ], function(err){

        if (err) return next();

        var onSuccess = function() {
            res.send({success: true});
        };

        var onFail = function(e) {
            req.flash('error', 'There was a problem signing you in, please try again.');
            return next();
        };

        keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);

    });
};
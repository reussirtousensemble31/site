var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res, next) {

    async.series([

        function(cb) {
            if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.passwordRe) {
                return cb('Saisissez l\'ensemble des champs du formulaire.');
            }

            if (req.body.password !== req.body.passwordRe) {
                return cb('Attention, vous n\'avez pas saisi 2 fois le même mot de passe.');
            }

            return cb();
        },

        function(cb) {
            keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {

                if (err || user) {
                    return cb('Un utilisateur inscrit utilise déjà cet email.');
                }

                return cb();
            });
        },

        function(cb) {
            var userData = {
                name: {
                    first: req.body.firstname,
                    last: req.body.lastname
                },
                email: req.body.email,
                password: req.body.password
            };

            var User = keystone.list('User').model,
                newUser = new User(userData);

            newUser.save(function(err) {
                return cb(err);
            });
        }

    ], function(err){

        if (err) {
            res.send({success: false, error: err});
            return;
        }

        var onSuccess = function() {
            res.send({success: true});
        };

        var onFail = function(e) {
            res.send({success: false});
        };

        keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);

    });
};
var keystone = require('keystone'),
    Enquiry = keystone.list('Enquiry'),
    Cours = keystone.list('Cours'),
    async = require('async');
//    Types = keystone.Field.Types;

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.enquirySubmitted = false;

    locals.data = {
        sections: [],
        cours: []
    };

    // On POST requests, add the Enquiry item to the database
    view.on('post', { action: 'contact' }, function(next) {

        var newEnquiry = new Enquiry.model(),
            updater = newEnquiry.getUpdateHandler(req);

        updater.process(req.body, {
            flashErrors: true,
            fields: 'name, email, phone, message',
            errorMessage: 'Il y a un problème dans l`enregistrement de votre message:'
        }, function(err) {
            if (err) {
                locals.validationErrors = err.errors;
            } else {
                locals.enquirySubmitted = true;
            }
            next();
        });

    });

    // On POST requests, add current user to course participants in the database
    view.on('post', { action: 'join' }, function(next) {
        Cours.model.findOne({'_id': keystone.mongoose.Types.ObjectId(req.body.id)})
             .populate('participants')
             .exec(function(err, cours) {

            if (cours) {
                cours.participants.push(req.user);

                cours.save(function(err) {
                    next(err);
                });
            }
        });
    });

    // On POST requests, remove current user to course participants in the database
    view.on('post', { action: 'leave' }, function(next) {
        Cours.model.findOne({'_id': keystone.mongoose.Types.ObjectId(req.body.id)})
            .populate('participants')
            .exec(function(err, cours) {
                var i, found = false;

                if (cours) {
                    for (i = 0 ; i < cours.participants.length; i++) {
                        console.log(cours.participants[i], req.user.id);

                        if (cours.participants[i].id === req.user.id) {
                            found = true;
                            break;
                        }
                    }

                    if (found) {
                        cours.participants.splice(i, 1);

                        cours.save(function(err) {
                            next(err);
                        });
                    }
                    else {
                        next(err);
                    }
                }
                else {
                    next(err);
                }
            });
    });

    // Load the posts
    view.on('init', function(next) {

        async.parallel([
            function(cb) {
                var q = keystone.list('Section').model.find();

                q.exec(function(err, results) {
                    locals.data.sections = results;

                    var alt = true;

                    results.forEach(function(section) {
                        section.alt = alt;
                        alt = !alt;
                    });

                    cb(err);
                });
            },
            function(cb) {
                var q = keystone.list('Cours')
                            .model.find()
                            .where('date').gte(new Date().setHours(0))
                            .populate('participants')
                            .sort('date');

                q.exec(function(err, results) {
                    locals.data.cours = results;

                    results.forEach(function(cours) {
                        if (cours.placesMaximum) {
                            cours.placesRestantes = cours.placesMaximum - cours.participants.length;
                        }

                        cours.notJoined = true;

                        if (req.user) {
                            cours.participants.forEach(function(participant){
                                if (participant.id === req.user.id) {
                                    cours.notJoined = false;
                                }
                            });
                        }
                    });

                    cb(err);
                });
            }
        ], function(err) {
            next(err);
        });
    });

	// Render the view
	view.render('index');
	
};

var keystone = require('keystone'),
    Enquiry = keystone.list('Enquiry');

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
        sections: []
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

    // Load the posts
    view.on('init', function(next) {

        var q = keystone.list('Section').model.find();

        q.exec(function(err, results) {
            locals.data.sections = results;

            var alt = true;

            results.forEach(function(section) {
                section.alt = alt;
                alt = !alt;
            });

            next(err);
        });

    });

	// Render the view
	view.render('index');
	
};

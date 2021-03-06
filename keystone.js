// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone'),
	handlebars = require('express3-handlebars');
//    process = require('process');
	

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.


keystone.init({

	'name': 'Reussir tous ensemble 31',
	'brand': 'Reussir tous ensemble 31',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'hbs',
	
	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs'
	}).engine,
	
	'emails': 'templates/emails',
	
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': '1m$5SNm?$T!5-_,K">xcHM.XP1+u~qIkslUE;V/8^xaV$PSv,~A9[,J1"WEzBT9+',

    'host': process.env.OPENSHIFT_NODEJS_IP || '192.168.3.10',
    'port': process.env.OPENSHIFT_NODEJS_PORT || 3000,

    'mongo': (process.env.OPENSHIFT_MONGODB_DB_URL) || 'mongodb://127.0.0.1:27017/' ,

    'signin redirect' : '/',
    'signout redirect': '/',

    "wysiwyg images": true
});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') == 'production') ? 'http://paulmusso:3000/' : 'http://192.168.3.10:3000/images/'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') == 'production') ? 'http://paulmusso:3000/' : 'http://192.168.3.10:3000/keystone/'
}]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
//	'posts': ['posts', 'post-categories'],
//	'galleries': 'galleries',
    'sections' : ['sections', 'images'],
    'cours' : 'cours',
	'messages': 'enquiries',
//	'sections': 'images',
    'utilisateurs': 'users'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();

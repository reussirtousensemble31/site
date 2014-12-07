var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
    abonnement: { type: Types.Boolean, default: false},
    dateAbonnement: {type: Types.Date, format: 'Do MMM YYYY', dependsOn: { 'abonnement': true }},
    duree: {type: Types.Number, label: 'durée (mois)', dependsOn: { 'abonnement': true }}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Administrateur', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();

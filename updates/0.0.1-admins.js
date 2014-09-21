/**
 * This script automatically creates a default Admin user when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 */

exports.create = {
	User: [
		{ 'name.first': 'Matthieu', 'name.last': 'Musso', email: 'reussirtousensemble31@gmail.com', password: 'reussir00', isAdmin: true }
	]
};
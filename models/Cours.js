var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Cours = new keystone.List('Cours', {
    singular: 'Cours'
});

Cours.add({
    date: {type: Types.Datetime, default: Date.now, required: true, format: 'Do MMM YYYY hh:mm:ss'},
    participants: {type: Types.Relationship, ref: 'User', many: true},
    placesMaximum: {type: Types.Number}
});

Cours.defaultSort = '-date';
Cours.defaultColumns = 'date, participants|70%';
Cours.register();
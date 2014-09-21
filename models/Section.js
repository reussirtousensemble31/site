var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Section Model
 * ==========
 */

var Section = new keystone.List('Section', {
    map: { name: 'titre' },
    autokey: { path: 'slug', from: 'titre', unique: true }
});

Section.add({
    titre: { type: String, required: true },
    nomIcone: { type: String },
    ancre: {type: String },
    contenu: { type: Types.Html, wysiwyg: true, height: 400 }
});

Section.defaultColumns = 'titre';
Section.register();

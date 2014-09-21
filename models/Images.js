var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Images Model
 * =============
 */

var Images = new keystone.List('Images', {
    autokey: { from: 'name', path: 'key', unique: true }
});

Images.add({
    name: { type: String, required: true },
    image: { type: Types.CloudinaryImage }
});

Images.register();
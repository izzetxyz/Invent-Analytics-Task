const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new Schema({
    _id: Number, 
    name: {
        type: String,
        trim: true
    },
    books: {
        past: {
            type: [Object],
            default: []
        },
        present: {
            type: [String],
            default: []
        }
    }
}, { collection: 'Users', timestamps: true });

UserSchema.plugin(AutoIncrement, { id: 'user_seq', inc_field: '_id' });

const User = mongoose.model('User', UserSchema);

module.exports = User;

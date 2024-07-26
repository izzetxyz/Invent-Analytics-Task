const { boolean } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new Schema({
    _id: Number, 
    name: {
        type: String,
        trim: true
    },
    score: {
        type: Number,
        default: -1
    },
    isBorrowed: {
        type: Boolean,
        default: false
    },
    borrowCount: {
        type:Number,
        default: 0
    }
}, { collection: 'Book', timestamps: true });

UserSchema.plugin(AutoIncrement, { id: 'book_seq', inc_field: '_id' });

const User = mongoose.model('Book', UserSchema);

module.exports = User;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            dropDups: true
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        imagelink: {
            type: String,
            required: true
        }
    }, {timestamps: true}
);

const User = mongoose.model('user', usersSchema);

module.exports = User;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const incomeSchema = new Schema(
    {
        amount: {
            type: "number",
            required: true
        },
        frequency: {
            type: String,
            required: true
        },
        user_email: {
            type: String,
            required: true
        }
    }, {timestamps: true}
);

const Income = mongoose.model('income', incomeSchema);

module.exports = Income;
const mongoose = require('mongoose');
const TempUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const TempUser = mongoose.model('TempUser', TempUserSchema);

module.exports = TempUser;
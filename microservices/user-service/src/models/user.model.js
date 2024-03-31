const mongoose = require('mongoose')
const UsersSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    }
})

UsersSchema.pre('save', function (next) {
    next()
})
const Users = mongoose.model('Users', UsersSchema);
module.exports = { Users }
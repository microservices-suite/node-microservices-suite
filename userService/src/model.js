const mongoose =  require('mongoose')
const UsersSchema =  mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    password:{
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true    
    }
})

const Users = mongoose.model('Users',UsersSchema);
module.exports = Users

const mongoose = require('mongoose');

const rbacSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Rbac = mongoose.model('rbac', rbacSchema);

module.exports =  Rbac;

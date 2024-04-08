const mongoose = require('mongoose')
const ObjectId = require('mongodb')

const supplierSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            require: true
        },
        phone:{
            type : String,
            require : true
        },
        email : {
            type : String,
            require : true
        },
        product_list:{
            type : Array
        }
    },
    {
        timestamp : true
    }
)

supplierSchema.index({ name, phone, email}, { unique : true})
module.exports = mongoose.model('supplier', supplierSchema)
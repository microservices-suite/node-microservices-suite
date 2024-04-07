const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const productSchema = new mongoose.Schema(
    {
        product_id : {
            type: String,
            required : true
        },
        name : {
            type : String,
            required : true
        },
        cost_price : {
            type : Number,
        },
        sell_price : {
            type : Number,
        },
        discount_id: {
            type : ObjectId
        },
        tax_id:{
            type : ObjectId
        },
        is_deleted : {
            type : Number,
            default : 0
        }
    },
    {
        timestamp : true
    }
)

productSchema.index({ product_id, name}, { unique : true})
module.export = mongoose.model('product', productSchema)
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const productSchema = new mongoose.Schema(
    {
        product_id : {
            type: String,
            required : true
        },
        product_name : {
            type : String,
            required : true
        },
        product_cost_price : {
            type : Number,
        },
        product_sell_price : {
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

productSchema.index({ product_id, product_name}, { unique : true})

module.export = mongoose.model('product', productSchema)
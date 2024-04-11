const mongoose = require("mongoose")
const {ObjectId} = require("mongodb")

const customerSchema = new mongoose.Schema(
    {
        customer_id: {
            type: String,
            require: true,
            default : "CUS-0001"
        },
        name: {
            type: String,
            require: true
        },
        phone: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        order_list: {
            type: Array
        },
        is_deleted: {
            type: Number,
            require: true,
            default:0
        }
    },
    {
        timestamp: true
    }
)

customerSchema.index({ customer_id, name},{unique : true})
module.exports = mongoose.model('customer', customerSchema)
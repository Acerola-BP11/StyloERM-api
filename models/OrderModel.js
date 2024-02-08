const mongoose = require('mongoose')

const stepSchema = new mongoose.Schema({
    step: String,
    Date: {
        type: Date,
        default: new Date()
    }
})

const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    material: String,
    color: String,
    pattern: String,
    patternCode: String,
    finishing: String,
    unitaryPrice: Number,
    totalPrice: Number
})

const orderSchema = new mongoose.Schema({
    client: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    city: String,
    adress: String,
    itens: [itemSchema],
    budget: Boolean,
    step: stepSchema,
    Date: {
        type: Date,
        default: new Date()
    },
    delivered: Boolean,
    canceled: Boolean
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
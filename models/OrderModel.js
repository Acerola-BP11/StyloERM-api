const mongoose = require('mongoose')
const Counter = require('./CounterCollection')

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
    size: String,
    finishing: String,
    unitaryPrice: Number,
    totalPrice: Number
})

const orderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        index: true,
        unique: true
    },
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

orderSchema.pre('save', async function() {
    const orderId = await Counter.getNextValue()
    console.log(orderId)
    this.set({ orderId })
    return
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
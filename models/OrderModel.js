const mongoose = require('mongoose')
const Counter = require('./CounterCollection')
const Tracking = require('./TrackingModel')

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
    paymentMethod: String,
    note: String,
    city: String,
    adress: String,
    itens: [itemSchema],
    budget: Boolean,
    Date: {
        type: Date,
        default: new Date()
    },
    delivered: Boolean,
    canceled: Boolean
})

orderSchema.pre('save', async function () {
    if (this.isNew) {
        const orderId = await Counter.getNextValue()
        console.log(orderId)
        this.set({ orderId })
        const firstStep = {
            step: 'Pedido recebido'
        }
        await Tracking.create({
            clientId: this.client,
            orderId: this.orderId,
            steps: [firstStep]
        })
    }
    return
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
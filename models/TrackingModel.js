const mongoose = require('mongoose')

const stepSchema = new mongoose.Schema({
    step: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: new Date()
    },
    endDate: {
        type: Date,
        default: null
    },
    note: String
})

const trackingSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        required: true
    },
    clientId: mongoose.SchemaTypes.ObjectId,
    steps: [{
        type: stepSchema,
        default: {
            step: 'Pedido recebido'
        }
    }]
})

const Tracking = mongoose.model('Tracking', trackingSchema)

module.exports = Tracking
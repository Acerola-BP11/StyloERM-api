const Tracking = require('../models/TrackingModel')

const getTrackingStatus = async (req, res) => {
    const orderId = req.params.orderId

    const trackingStatus = await Tracking.find({orderId})

    res.send(trackingStatus)
}

const newTrackingStep = async (req, res) => {
    const orderId = req.params.orderId
    const {step, startDate, endDate, note} = req.body
    const tracking = await Tracking.findOne({orderId})
    const newStep = {
        step,
        startDate,
        endDate,
        note
    }
    tracking.steps.push(newStep)
    await tracking.save()
    res.status(200).send('Passo inserido com sucesso!')
}

module.exports = {getTrackingStatus, newTrackingStep}
var express = require('express');
const { getTrackingStatus, newTrackingStep } = require('../controllers/trackingController');
var router = express.Router();

// router.all('*', sessionMiddleware)
router.get('/:orderId', getTrackingStatus)
router.post('/newStep/:orderId', newTrackingStep)

module.exports = router
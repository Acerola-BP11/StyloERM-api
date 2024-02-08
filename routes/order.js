var express = require('express');
const { getOrders, getOrder, getClientHistory, newOrder, updateOrder, cancelOrder } = require('../controllers/orderController');
var router = express.Router();

router.get('/', getOrders)
router.get('/:orderId', getOrder)
router.get('/history/:clientId', getClientHistory)
router.post('/', newOrder)
router.patch('/:orderId', updateOrder)
router.patch('/cancel/:orderId', cancelOrder)

module.exports = router
var express = require('express');
const { getOrders, getOrder, getClientHistory, newOrder, updateOrder, cancelOrder, getOrderPDF, getOrderPDFSupplier } = require('../controllers/orderController');
var router = express.Router();

router.get('/', getOrders)
router.get('/pdf/:orderId', getOrderPDF)
router.get('/pdf/:orderId/supplier', getOrderPDFSupplier)
router.get('/:orderId', getOrder)
router.get('/history/:clientId', getClientHistory)
router.post('/', newOrder)
router.patch('/:orderId', updateOrder)
router.delete('/cancel', cancelOrder)

module.exports = router
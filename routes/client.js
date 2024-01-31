var express = require('express');
const sessionMiddleware = require('../middleware/sessionMiddleware');
const { getClients, createClientCNPJ,
    createClientPhysical, getClient,
    updateClientCNPJ, updateClientPhysical, deleteClient
} = require('../controllers/clientController');
var router = express.Router();

router.all('*', sessionMiddleware)
router.get('/', getClients)
router.get('/:clientId', getClient)
router.post('/cnpj', createClientCNPJ)
router.post('/physical', createClientPhysical)
router.put('/cnpj/:cnpj', updateClientCNPJ)
router.put('/physical/:cpf', updateClientPhysical)
router.delete('/:clientId', deleteClient)


module.exports = router;

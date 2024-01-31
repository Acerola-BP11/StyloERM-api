const mongoose = require('mongoose')

const clientPhysicalSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    cep: String,
    cidade: String,
    endereco: String,
    bairro: String,
    estado: String,
    numero: String,
    pessoa_contato: String,
    telefone1: String,
    telefone2: String,
    email: String
})

const ClientPhysical = mongoose.model('ClientPhysical', clientPhysicalSchema)

module.exports = ClientPhysical
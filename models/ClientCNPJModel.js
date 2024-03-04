const mongoose = require('mongoose')

const clientCNPJSchema = new mongoose.Schema({
    razao: {
        type: String,
        required: true
    },
    nome_fantasia: String,
    cnpj: {
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
    email: String,
    inscricao_estadual: {
        type: String,
        required: true,
        default: 'ISENTO'
    }
})

const ClientCNPJ = mongoose.model('ClientCNPJ', clientCNPJSchema)

module.exports = ClientCNPJ
const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        index: true
    }
})

counterSchema.statics.getNextValue = async function() {
    let counter = await this.findOne(); // Encontra o contador existente
    let nextId = 1; // Define o próximo ID como 1 por padrão

    if (counter) { // Se houver um contador existente
        nextId = counter.id + 1; // Incrementa o ID para o próximo valor
        await counter.updateOne({ id: nextId }); // Atualiza o ID do contador existente
    } else {
        await this.create({ id: nextId }); // Se não houver contador, cria um novo com o ID 1
    }

    return nextId; // Retorna o novo ID
};

const Counter = mongoose.model('Counter', counterSchema)

module.exports = Counter
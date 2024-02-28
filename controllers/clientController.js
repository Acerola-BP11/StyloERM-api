const ClientCNPJ = require("../models/ClientCNPJModel")
const ClientPhysical = require("../models/ClientPhysicalModel")

const createClientCNPJ = async (req, res) => {
    const { razao, nome_fantasia,
        cnpj, cep, cidade,
        endereco, bairro,
        estado, numero, pessoa_contato,
        telefone1, telefone2, email,
        inscricao_estadual } = req.body

    if (!razao || !cnpj) {
        res.status(400).send('Os dados Razão e CNPJ são obrigatórios.')
        return
    }
    await ClientCNPJ.create({
        razao, nome_fantasia,
        cnpj, cep, cidade,
        endereco, bairro,
        estado, numero, pessoa_contato,
        telefone1, telefone2, email,
        inscricao_estadual
    })
        .catch(_ => {
            res.status(500).send('Erro ao criar cliente')
            return
        })
    res.status(200).send('Cliente criado com sucesso!')
}

const createClientPhysical = async (req, res) => {
    const { nome, cpf, cep, cidade, endereco, bairro,
        estado, numero, pessoa_contato, telefone1, telefone2,
        email } = req.body

    if (!nome || !cpf) {
        res.status(400).send('O campo Nome e CPF são obrigatorios')
        return
    }

    await ClientPhysical.create({
        nome, cpf, cep, cidade, endereco, bairro,
        estado, numero, pessoa_contato, telefone1, telefone2,
        email
    })
        .catch(_ => {
            res.status(500).send('Erro ao criar cliente')
            return
        })

    res.status(200).send('Cliente criado com sucesso!')

}

const getClient = async (req, res) => {

    try {
        cnpj_cpf = req.params.clientId
        const client = await ClientCNPJ.findOne({ cnpj: cnpj_cpf }) || await ClientPhysical.findOne({ cpf: cnpj_cpf })
        if (!client) {
            res.status(404).send('Cliente não encontrado')
            return
        }

        res.status(200).send(client)
    } catch (error) {
        res.status(500).send('Erro ao pesquisar cliente!')
    }

}

const getClients = async (_, res) => {
    const clients = (await ClientCNPJ.find()).concat((await ClientPhysical.find()))
    res.status(200).send(clients)
}

const updateClientCNPJ = async (req, res) => {

    const newClientData = {
        razao, nome_fantasia,
        cnpj, cep, cidade,
        endereco, bairro,
        estado, numero, pessoa_contato,
        telefone1, telefone2, email,
        inscricao_estadual
    } = req.body

    const clientCNPJ = req.params.cnpj

    try {
        await ClientCNPJ.updateOne({ cnpj: clientCNPJ }, newClientData)
        res.status(200).send('Cliente atualizado com sucesso!')
    } catch (_) {
        res.status(500).send('Erro ao atualizar o Cliente')
    }


}

const updateClientPhysical = async (req, res) => {

    const newClientData = {
        nome, cpf, cep, cidade, endereco, bairro,
        estado, numero, pessoa_contato, telefone1, telefone2,
        email
    } = req.body

    const clientCPF = req.params.cpf

    try {
        await ClientPhysical.updateOne({ cpf: clientCPF }, newClientData)
        res.status(200).send('Cliente atualizado com sucesso!')
    } catch (_) {
        res.status(500).send('Erro ao atualizar o Cliente')
    }

}

const deleteClient = async (req, res) => {

    const cnpj_cpf_list = req.body.ids;

    try {
        const deleteResultPhysicals = await ClientPhysical.deleteMany({ cpf: { $in: cnpj_cpf_list } });
        const deleteResultCNPJs = await ClientCNPJ.deleteMany({ cnpj: { $in: cnpj_cpf_list } });

        const totalDeleted = deleteResultPhysicals.deletedCount + deleteResultCNPJs.deletedCount;

        if (totalDeleted > 0) {
            return res.status(200).send(`Foram excluídos ${totalDeleted} cliente(s) com sucesso.`);
        } else {
            return res.status(404).send('Clientes não encontrados para exclusão.');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Erro interno ao excluir clientes.');
    }
}

const autoFillClients = async (req, res) => {

    try {
        const clients = (await ClientCNPJ.find()).concat((await ClientPhysical.find()))
        const clientData = clients.map(client => {
            return {
                clientId: client._id,
                razao_nome: client.nome || client.razao,
                cnpj_cpf: client.cpf || client.cnpj,
                endereco: client.endereco + ' ' + client.numero,
                cidade: client.cidade
            }
        })
        console.log(clientData)
        res.status(200).send(clientData)
    } catch (e) {
        console.error(e)
        res.status(500).send('Erro ao preencher cliente!')
    }

}

    const getClientById = async(req, res) =>{
        const clientId = req.params.id
        try {
            const client = await ClientCNPJ.findById(clientId) || await ClientPhysical.findById(clientId)
            res.status(200).send(client)
        } catch (error) {
            console.error(error)
            res.status(500).send('Ocorreu um erro ao buscar as informações do cliente!')
        }
    }


module.exports = {
    createClientCNPJ, getClients, createClientPhysical, getClient, updateClientCNPJ, updateClientPhysical, deleteClient, autoFillClients, getClientById
}
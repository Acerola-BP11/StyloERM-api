const Order = require("../models/OrderModel")

const newOrder = async (req, res) => {
    const { client, city, adress, itens, budget } = req.body
    try {
        await Order.create({ client, city, adress, itens, budget, delivered: false, canceled: false })
        res.status(200).send('Pedido criado com sucesso!')
    } catch (e) {
        console.error(e)
        res.status(500).send("Falha ao criar o Pedido")
    }
}

const getOrders = async (_, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: "clientcnpjs",
                    localField: "client",
                    foreignField: "_id",
                    as: "clientInfoClientsCnpjs"
                }
            },
            {
                $lookup: {
                    from: "clientphysicals",
                    localField: "client",
                    foreignField: "_id",
                    as: "clientInfoClientPhysicals"
                }
            },
            {
                $project: {
                    _id: 1,
                    city: 1,
                    adress: 1, 
                    itens: 1, 
                    budget: 1, 
                    Date: 1, 
                    delivered: 1, 
                    canceled: 1,
                    clientInfo: {
                        $concatArrays: ["$clientInfoClientsCnpjs", "$clientInfoClientPhysicals"]
                    }
                }
            }
        ]);
        res.status(200).send(orders)
    } catch (error) {
        console.error(error)
        res.status(500).send('Erro ao buscar pedidos')
    }

}

const getOrder = async (req, res) => {
    const orderId = req.params.orderId

    const order = await Order.findById(orderId)
        .catch(e => {
            console.error(e)
            res.status(500).send("Erro ao buscar Pedido")
        })

    res.status(200).send(order)

}

const getClientHistory = async (req, res) => {
    const clientId = req.params.clientId

    const orders = await Order.find({ client: clientId })
        .catch(e => {
            console.error(e)
            res.status(500).send('Erro ao buscar histórico de pedidos do Cliente')
        })

    res.status(200).send(orders)

}

const updateOrder = async (req, res) => {
    const orderId = req.params.orderId
    const { city, adress, itens, budget, step } = req.body

    const order = await Order.findByIdAndUpdate(orderId, { city, adress, itens, budget, step })
        .catch(e => {
            console.error(e)
            res.status(500).send('Erro ao atualizar Pedido')
        })

    res.status(200).send('Pedido atualizado com sucesso!')

}

const cancelOrder = async (req, res) => {
    const orderId = req.params.orderId
    const canceled = req.body.canceled

    Order.findByIdAndUpdate(orderId, { canceled })
        .catch(e => {
            console.error(e)
            res.status(500).send('Erro ao alterar o status de cancelamento do Pedido')
        })

    res.status(200).send('Pedido cancelado com sucesso!')

}

module.exports = {
    newOrder, getOrders, getOrder, getClientHistory, updateOrder, cancelOrder
}
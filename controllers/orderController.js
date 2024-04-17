const PDFDocument = require('pdfkit-table');
const Order = require("../models/OrderModel");
const { toReal } = require('../utils/utils');
const { startCase } = require('lodash');

const newOrder = async (req, res) => {
    const { client, city, adress, itens, budget, note, paymentMethod } = req.body
    try {
        await Order.create({ client, city, adress, itens, budget, delivered: false, canceled: false, note, paymentMethod })
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
                    orderId: 1,
                    city: 1,
                    adress: 1,
                    itens: 1,
                    budget: 1,
                    Date: 1,
                    delivered: 1,
                    canceled: 1,
                    uf: 1,
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

    const order = await Order.findOne({ orderId })
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
    const { city, adress, itens, budget, step, note, paymentMethod } = req.body

    await Order.findByIdAndUpdate({ orderId }, { city, adress, itens, budget, step, note, paymentMethod })
        .catch(e => {
            console.error(e)
            res.status(500).send('Erro ao atualizar Pedido')
        })

    res.status(200).send('Pedido atualizado com sucesso!')

}

const cancelOrder = async (req, res) => {
    const orderId = req.body.selectedIds
    const canceled = true

    Order.updateMany({ orderId: { $in: orderId } }, { canceled })
        .catch(e => {
            console.error(e)
            res.status(500).send('Erro ao alterar o status de cancelamento do Pedido')
        })

    res.status(200).send('Pedido cancelado com sucesso!')

}

const getOrderPDF = async (req, res) => {

    const orderId = req.params.orderId
    console.log(orderId)

    const order = (await Order.aggregate([
        {
            $match: {
                orderId: Number(orderId)
            }
        },
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
                orderId: 1,
                city: 1,
                adress: 1,
                itens: {
                    $map: {
                        input: "$itens",
                        as: "item",
                        in: {
                            $mergeObjects: [
                                "$$item",
                                {
                                    unitaryPrice: { $ifNull: ["$$item.unitaryPrice", 0] },
                                    totalPrice: { $ifNull: ["$$item.totalPrice", 0] },
                                    quantity: { $ifNull: ["$$item.quantity", 0] }
                                }
                            ]
                        }
                    }
                },
                budget: 1,
                Date: 1,
                paymentMethod: 1,
                clientInfo: {
                    $concatArrays: ["$clientInfoClientsCnpjs", "$clientInfoClientPhysicals"]
                }
            }
        }
    ]))[0];

    if (!order) {
        res.status(404).send('Pedido não encontrado')
        return
    }

    console.log(order)

    const orderTotal = order.itens.reduce((valorAnt, valorAtu) => {
        return valorAnt + valorAtu.totalPrice
    }, 0)

    const doc = new PDFDocument({
        size: 'A4'
    })

    const rows = order.itens.map(item => {
        item.name = startCase(item.name)
        item.material = startCase(item.material)
        item.color = startCase(item.color)
        item.pattern = startCase(item.pattern)
        item.finishing = startCase(item.finishing)
        return item
    })

    const header = () => {
        doc
            .lineCap('square')
            .lineWidth(2)
            .strokeColor('black')
            .rect(10, 10, 575, 130)
            .stroke()
            .image('./utils/logo-no-background.png', 20, 0, { width: 130 })
            .fontSize(25)
            .text('Stylo Vest Eventos', 225, 50, { align: 'center' })
            .fontSize(10)
            .text('09.658.291/0001-84', {
                align: 'center'
            })
            .moveDown()
            .fontSize(15)
            .text(`${order.budget ? 'Orçamento' : 'Pedido'} número ${order.orderId}`, { align: 'center' })
            .lineCap('square')
            .strokeColor('black')
            .rect(10, 140, 575, 690)
            .stroke()
            .fontSize(10)
            .font('Helvetica-Bold')
            .text(`Rodrigo Gaioto Struchel - (14) 98141-1012`, 380, 145, {
                lineBreak: false
            })
            .font('Helvetica')

    }

    const options = {
        prepareHeader: () => {
            doc.lineCap('square')
                .lineWidth(2)
                .strokeColor('black')
                .fontSize(10)
                .font("Helvetica-Bold")
                .rect(10, 10, 575, 820)
                .stroke()
        },
        prepareRow: () => doc.font('Helvetica').fontSize(8),
        divider: {
            horizontal: { disabled: false, width: 0.5, opacity: 0.5 }
        },
        x: 17.75
    }

    const table = {
        headers: [
            { label: 'Produto', width: 90, align: 'center', property: 'name' },
            { label: 'Quantidade', width: 60, align: 'center', property: 'quantity' },
            { label: 'Tecido', width: 50, align: 'center', property: 'material' },
            { label: 'Cor', width: 40, align: 'center', property: 'color' },
            { label: 'Desenho', width: 50, align: 'center', property: 'pattern' },
            { label: 'Tamanho', width: 60, align: 'center', property: 'size' },
            { label: 'Acabamento', width: 90, align: 'center', property: 'finishing' },
            { label: 'Preço Unitário', width: 60, align: 'center', property: 'unitaryPrice', renderer: (value) => toReal(value) || 0 },
            { label: 'Preço Total', width: 60, align: 'center', property: 'totalPrice', renderer: (value) => toReal(value) || 0 }
        ],
        datas: rows,
        options: options
    }

    doc.pipe(res)
    header()
    doc
        .fontSize(15)
        .text(`Cliente:`, 20, 160, {
            continued: true
        })
        .font('Helvetica-Bold')
        .text(` ${order.clientInfo[0]?.razao || order.clientInfo[0]?.nome}`)
        .font('Helvetica')
        .text('Data:', {
            continued: true
        })
        .font('Helvetica-Bold')
        .text(` ${order.Date.toLocaleString('pt-br', {
            dateStyle: 'short'
        })}`)
        .font('Helvetica')
        .text(`Endereço:`, {
            continued: true
        })
        .font('Helvetica-Bold')
        .text(` ${order.adress}, ${order.city}`)
        .font('Helvetica')
        .text(`Forma de pagamento:`, {
            continued: true
        })
        .font('Helvetica-Bold')
        .text(` ${startCase(order.paymentMethod)}`)
        .font('Helvetica')
        .moveDown(2)
    doc
        .table(table)
    doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`Total do Pedido: ${toReal(orderTotal)}`, 380)
    doc.end()

}

const getOrderPDFSupplier = async (req, res) => {

    const orderId = req.params.orderId

    const order = await Order.findOne({orderId})

    if (!order) {
        res.status(404).send('Pedido não encontrado')
        return
    }

    res.setHeader('title', `Pedido${orderId}`)
    res.setHeader('Content-type', 'file/pdf');
    res.setHeader('Content-disposition', `attachment; filename=Pedido${orderId}.pdf`);
    console.log(order)

    const doc = new PDFDocument({
        size: 'A4'
    })

    const rows = order.itens.map(item => {
        item.name = startCase(item.name)
        item.material = startCase(item.material)
        item.color = startCase(item.color)
        item.pattern = startCase(item.pattern)
        item.finishing = startCase(item.finishing)
        return item
    })

    const header = () => {
        doc
            .lineCap('square')
            .lineWidth(2)
            .strokeColor('black')
            .rect(10, 10, 575, 130)
            .stroke()
            .image('./utils/logo-no-background.png', 20, 0, { width: 130 })
            .fontSize(25)
            .text('Stylo Vest Eventos', 225, 50, { align: 'center' })
            .fontSize(10)
            .text('09.658.291/0001-84', {
                align: 'center'
            })
            .moveDown()
            .fontSize(15)
            .text(`Pedido número ${order.orderId}`, { align: 'center' })
            .lineCap('square')
            .strokeColor('black')
            .rect(10, 140, 575, 690)
            .stroke()
            .fontSize(10)
            .font('Helvetica-Bold')
            .text(`Rodrigo Gaioto Struchel - (14) 98141-1012`, 380, 145, {
                lineBreak: false
            })
            .font('Helvetica')

    }

    const options = {
        prepareHeader: () => {
            doc.lineCap('square')
                .lineWidth(2)
                .strokeColor('black')
                .fontSize(10)
                .font("Helvetica-Bold")
                .rect(10, 10, 575, 820)
                .stroke()
        },
        prepareRow: () => doc.font('Helvetica').fontSize(8),
        divider: {
            horizontal: { disabled: false, width: 0.5, opacity: 0.5 }
        },
        x: 17.75
    }

    const table = {
        headers: [
            { label: 'Produto', width: 80, align: 'center', property: 'name' },
            { label: 'Quantidade', width: 80, align: 'center', property: 'quantity' },
            { label: 'Tecido', width: 80, align: 'center', property: 'material' },
            { label: 'Cor', width: 80, align: 'center', property: 'color' },
            { label: 'Desenho', width: 80, align: 'center', property: 'pattern' },
            { label: 'Tamanho', width: 80, align: 'center', property: 'size' },
            { label: 'Acabamento', width: 80, align: 'center', property: 'finishing' }
        ],
        datas: rows,
        options: options
    }

    doc.pipe(res)
    header()
    doc
        .fontSize(15)
        .font('Helvetica')
        .text('Data:', 20, 160, {
            continued: true
        })
        .font('Helvetica-Bold')
        .text(` ${order.Date.toLocaleString('pt-br', {
            dateStyle: 'short'
        })}`)
        .font('Helvetica')
        .moveDown(2)
    doc
        .table(table)
    doc.end()
}

module.exports = {
    newOrder, getOrders, getOrder, getClientHistory, updateOrder, cancelOrder, getOrderPDF, getOrderPDFSupplier
}
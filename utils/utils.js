const toReal = (value) => {
    const stringValue = parseFloat(value).toFixed(2).toString()
    const valueInReais = 'R$ ' + stringValue.replace('.', ',')
    return valueInReais
}

module.exports = {
    toReal
}
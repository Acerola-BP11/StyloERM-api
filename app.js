var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan')
var cors = require('cors')
require('./utils/database')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clientsRouter = require('./routes/client')
var orderRouter = require('./routes/order')

var app = express();

app.use(cors({
    origin: 'https://styloerm.vercel.app'
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/clients', clientsRouter)
app.use('/orders', orderRouter)

const port = process.env.PORT || '8080'

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))

module.exports = app;

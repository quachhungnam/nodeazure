const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const posts_route = require('./api/routes/posts_route')
const transactions_route = require('./api/routes/transactions_route')
const rates_route = require('./api/routes/rates_route')
const post_types_route = require('./api/routes/post_types_route')


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect('mongodb+srv://'
    + process.env.MONGO_ATLAS_PW +
    '@cluster0-n3imy.mongodb.net/dbcnpm?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
)
mongoose.Promise = global.Promise

app.use('/posts', posts_route)
app.use('/posttypes', post_types_route)
app.use('/transactions', transactions_route)
app.use('/rates', rates_route)
// app.use('/postspending',posts_route.)


app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type,Accept,Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,PATH,POST,DELETE,GET')
        return res.status(200).json({})
    }
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})





module.exports = app
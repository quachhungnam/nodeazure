const mongoose = require('mongoose')
const transaction_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    locked: { type: Boolean, default: false },
    created_at: { type: Date, default: Date().now },
    update_at: { type: Date }
})

module.exports = mongoose.model('Transaction', transaction_schema)
const mongoose = require('mongoose')
const rate_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, default: '' },
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    star: { type: Number, min: 0, max: 5 },
    description: { type: String, default: '' },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: null },
    deleted_at: { type: Date, default: null }

})

module.exports = mongoose.model('Rate', rate_schema)
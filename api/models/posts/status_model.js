const mongoose = require('mongoose')
const status_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String },
    created_at: { type: Date },
    updated_at: { type: Date },
    deleted_at: { type: Date }
})

module.exports = mongoose.model('Status', status_schema)
const mongoose = require('mongoose')
const province_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    created_at: { type: Date },
    updated_at: { type: Date },
    deleted_at: { type: Date }
})

module.exports = mongoose.model('Province', province_schema)
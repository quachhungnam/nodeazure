const mongoose = require('mongoose')
const post_type_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, default: '' },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() },
    deleted_at: { type: Date, default: null }
})

module.exports = mongoose.model('Post_type', post_type_schema)
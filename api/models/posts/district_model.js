const mongoose = require('mongoose')
const district_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
    description: { type: String },
    created_at: { type: Date },
    updated_at: { type: Date },
    deleted_at: { type: Date }

})

module.exports = mongoose.model('District', district_schema)
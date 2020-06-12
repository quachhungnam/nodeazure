const mongoose = require('mongoose')
const status_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: { type: Number, required: true, unique: true },
    //0: chua duyet, 1: da duyet va dang, 2: da dat cho, 3: da thue, ko hien
    description: { type: String, default: '' },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: null },
})

module.exports = mongoose.model('Status', status_schema)
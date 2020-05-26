const mongoose = require('mongoose')
const content_type_schema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    app_label: String,
    model: String,
})

module.exports = mongoose.model('Content_type', content_type_schema)
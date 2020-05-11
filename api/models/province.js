const mongoose = require('mongoose');

const provinceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    name_with_type: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Province', provinceSchema);
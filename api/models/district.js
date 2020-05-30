const mongoose = require('mongoose');

const districtSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    name_with_type: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    path_with_type: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    parent_code: {
        type: String,
        required: true
    },
    province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
});

module.exports = mongoose.model('District', districtSchema)
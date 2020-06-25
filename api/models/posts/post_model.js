const mongoose = require('mongoose')
const post_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, default: '', required: true },
    host_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    post_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post_type' },
    province_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
    district_id: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
    status_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Status' },
    hot: { type: Boolean, default: false },
    price: { type: Number, required: true },
    square: { type: Number, min: 4 },
    address_detail: { type: String, default: '' },
    description: { type: String, default: '' },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: null },
    post_image: { type: [{ _id: mongoose.Schema.Types.ObjectId, path: { type: String } }], default: [] }
})

module.exports = mongoose.model('Post', post_schema)
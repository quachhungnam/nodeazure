const mongoose = require('mongoose')
const post_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, default: '', required: true },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    post_type: { type: mongoose.Schema.Types.ObjectId, ref: 'Post_type' },
    province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
    district: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
    status: { type: Boolean, default: false }, //false=pendding
    hot: { type: Boolean, default: false },
    price: { type: Number, required: true },
    square: { type: Number, min: 4 },
    address_detail: { type: String, default: '' },
    description: { type: String, default: '' },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() },
    deleted_at: { type: Date, default: null }
})

module.exports = mongoose.model('Post', post_schema)
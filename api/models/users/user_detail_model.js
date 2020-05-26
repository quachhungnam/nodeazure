const mongoose = require('mongoose')
const user_detail_model = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    firt_name: { type: String, required: true },
    last_name: { type: String },
    is_active: { type: Boolean },
    date_joined: { type: Date },
    last_login: { type: Date },
    address: { type: String },
    mobile: { type: String },
})
module.exports = mongoose.model('User_detail', user_detail_model,'User_detail')
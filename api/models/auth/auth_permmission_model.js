const mongoose = require('mongoose')
const auth_permission_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String },
    codename: { type: String }
})

module.exports = mongoose.model('Auth_permission', auth_permission_schema)
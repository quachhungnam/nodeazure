const mongoose = require('mongoose')
const auth_user_permission_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permisstion: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth_permission' }
})

module.exports = mongoose.model('Auth_user_permission', auth_user_permission_schema)
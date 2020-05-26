const mongoose = require('mongoose')
const user_schema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: {
        type: String,
        require: true,
        // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true }
})

module.exports = mongoose.model('User', user_schema)
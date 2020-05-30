const mongoose = require('mongoose');
const permissionSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        object: {
            type: String,
            required: true
        },
        _create: {
            type: Boolean
        },
        _read: {
            type: Boolean
        },
        _update: {
            type: Boolean
        }
        ,_delete: {
            type: Boolean
        }
        ,locked: {
            type: Boolean
        }
});
module.exports = mongoose.model('permission', permissionSchema);
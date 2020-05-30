const mongoose = require('mongoose');
const role_permissionSchema = mongoose.Schema({
    role_id:  
    {
        type: mongoose.Schema.Types.ObjectId
    },
    permission_id:  
    {
        type: mongoose.Schema.Types.ObjectId
    }
});
module.exports = mongoose.model('role_permission', role_permissionSchema);
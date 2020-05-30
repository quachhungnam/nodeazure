const mongoose = require('mongoose');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const Role_Permission = require('../models/role_permission.model');
const Account = require('../models/account');
const Account_Role = require('../models/account_role.model');

/**
 * @author maixuandiep810
 * @description Kiem tra permission cua 1 request (ung voi 1 TOKEN - 1USER nao do) - co CHO PHEP next() hay khong
 */
var checkPermission = (req, res, next) => {
    /**
     * @description Chuyen cac string ("POST", "PATCH",...) 
     * --> cac string tuong ung o table PERMISSION ("_create", "_update")
     * Ex: x = "PATCH" 
     * -> y = mapHttpMethod_CRUD[x]
     * -> y = "_update"
     */    
    var mapHttpMethod_CRUD = {
        "POST": "_create",
        "GET": "_read",
        "PATCH": "_update",
        "DELETE": "_delete"
    }
    /*
     * Ex: action_name = mapHttpMethod_CRUD["POST"] --> action_name = "_create"
     * object: /api/post, /api/account
     * roleList: ObjectId(111),  ObjectId(222) : Cac ROLE co trong he thong ung voi (object, action)
     * account_roleList: ObjectId(111),  ObjectId(222): Cac ROLE cua account nay
     * query = {"object": "api/post", "_create": true}
     * --> Tuong ung cau lenh WHERE
     */ 
    var action_name = mapHttpMethod_CRUD[req.method];
    var action_value = true; 
    var object = req.originalUrl; 
    var roleList = []; 
    var account_id = req.account_id; 
    var account_roleList = [];
    var query = {};
    query["object"] = object;
    query[action_name] = action_value;
    //
    Account_Role.find({"account_id": req.userData.accountId}).exec()
    .then((data) => {
        if (data == null) {
            console.log("vcsjdcj");
            return res.status(500);
        }
        account_roleList = data.map((item) => item.role_id.toString());
        console.log(query);
        return Permission.findOne(query).exec();
    })
    .then((data) => {
        if (data == null) {
            console.log("vcsjdcj");
            return res.status(500);
        }
        let perm = data._id;
        return Role_Permission.find({"permission_id": perm}).exec();
    })
    .then((data) => {
        if (data ==  null) {
            return res.status(500);
        }
        roleList = data.map(item => item.role_id.toString());
        account_roleList.forEach(item => {
            // console.log(roleList.indexOf(item));
            if (roleList.indexOf(item) > -1) {
                next();
            }
            else {
                return res.status(401).json({message: 'Unauthorized'});
            }
        });
    });       
}

module.exports = {
    checkPermission: checkPermission
}
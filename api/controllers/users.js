const mongoose = require('mongoose');

const User = require('../models/user');
const Account = require('../models/account');

exports.users_get_all = (req, res, next) => {
    User.find()
        .select('_id account name email mobile address created_at created_by updated_at updated_by')
        .populate('account', 'username')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        account: doc.account,
                        name: doc.name,
                        email: doc.email,
                        mobile: doc.mobile,
                        address: doc.address,
                        created_at: doc.created_at,
                        created_by: doc.created_by,
                        updated_at: doc.updated_at,
                        updated_by: doc.updated_by,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.users_get_user = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('_id account name email mobile address created_at created_by updated_at updated_by')
        .populate('account', 'username')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    user: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users'
                    }
                });
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.users_create_user = (req, res, next) => {
    Account.findById(req.body.accountId)
        .then(account => {
            if (!account) {
                return res.status(404).json({
                    message: 'Account not found'
                });
            }
            const user = new User({
                _id: mongoose.Types.ObjectId(),
                account: req.body.accountId,
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                address: req.body.address,
                created_at: new Date(),
                created_by: req.body.accountId,
                updated_at: null,
                update_by: null
            });
            return user
                .save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'User stored',
                createdUser: {
                    _id: result._id,
                    account: result.account,
                    name: result.name,
                    email: result.email,
                    mobile: result.mobile,
                    address: result.address,
                    created_at: result.created_at,
                    created_by: result.created_by,
                    updated_at: result.updated_at,
                    update_by: result.updated_by
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.users_update_user = (req, res, next) => {
    User.findById(req.params.userId)
        .select('account')
        .populate('account')
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            var accountId = user.account._id;
            const id = req.params.userId;
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            updateOps.updated_at = new Date();
            updateOps.updated_by = accountId;
            User.update({ _id: id }, { $set: updateOps })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'User updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + id
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Account = require('../models/account');
const User = require('../models/user');

exports.accounts_get_all = (req, res, next) => {
    Account.find()
        .select('_id username password status created_at created_by updated_at updated_by')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                accounts: docs.map(doc => {
                    return {
                        _id: doc._id,
                        username: doc.username,
                        password: doc.password,
                        status: doc.status,
                        created_at: doc.created_at,
                        created_by: doc.created_by,
                        updated_at: doc.updated_at,
                        updated_by: doc.updated_by,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/accounts/' + doc._id
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

exports.accounts_get_account = (req, res, next) => {
    const id = req.params.accountId;
    Account.findById(id)
        .select('_id username password status created_at created_by updated_at updated_by')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    account: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/accounts'
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

exports.account_signup = (req, res, next) => {
    Account.find({ username: req.body.username })
        .exec()
        .then(account => { // user array
            if (account.length >= 1) {
                return res.status(409).json({
                    message: 'Username exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        var accountId = new mongoose.Types.ObjectId();
                        const account = new Account({
                            _id: accountId,
                            username: req.body.username,
                            password: hash,
                            status: req.body.status,
                            created_at: new Date(),
                            created_by: accountId,
                            updated_at: null,
                            update_by: null
                        });
                        account
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'Account created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
};

exports.account_login = (req, res, next) => {
    Account.find({ username: req.body.username })
        .exec()
        .then(account => {
            if (account.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, account[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            username: account[0].username,
                            accountId: account[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.accounts_update_account = (req, res, next) => {
    const id = req.params.accountId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    updateOps.updated_at = new Date();
    updateOps.updated_by = id;
    Account.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Account updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/accounts/' + id
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

exports.accounts_delete_account = (req, res, next) => {
    const id = req.params.accountId;
    Account.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Account deleted',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    User.remove({ account: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
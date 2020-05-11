const mongoose = require('mongoose');

const Province = require('../models/province');
const District = require('../models/district');

exports.provinces_get_all = (req, res, next) => {
    Province.find()
        .select('_id code name')
        .exec()
        .then(docs => {
            console.log(docs);
            const response = {
                count: docs.length,
                provinces: docs.map(doc => {
                    return {
                        _id: doc._id,
                        code: doc.code,
                        name: doc.name,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/provinces/' + doc._id
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

exports.provinces_create_province = (req, res, next) => {
    const province = new Province({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    province
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created province successfully',
                createdProvince: {
                    _id: result._id,
                    name: result.name,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/provinces/" + result._id
                    }
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

exports.provinces_get_province = (req, res, next) => {
    const id = req.params.provinceId;
    Province.findById(id)
        .select('_id code name')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    province: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/provinces'
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

exports.provinces_update_province = (req, res, next) => {
    const id = req.params.provinceId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Province.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Province updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/provinces/' + id
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

exports.provinces_delete_province = (req, res, next) => {
    const id = req.params.provinceId;
    Province.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Province deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/provinces',
                    body: { name: 'String' }
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
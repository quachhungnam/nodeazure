const mongoose = require('mongoose')

const Post = require('../models/posts/post_model')
const Province = require('../models/province')
// const Status = require('../models/posts/status_model')
const District = require('../models/district')
const Post_type = require('../models/posts/post_type_model')
const Account = require('../models/account')
const User = require('../models/user')
const Rate = require('../models/posts/rate_model')
const Transaction = require('../models/posts/transaction_model')

module.exports.add_post = async (req, res, next) => {
    try {
        //get ID_account trong token va kiem tra
        const accountID = req.userData.accountId
        const account = await Account.findById(accountID)
        if (!account) {
            return res.status(404).json({ error: 'account not found' })
        }
        const post_type = await Post_type.findById(req.body.post_type)
        if (!post_type) {
            return res.status(404).json({ error: 'post type not found' })
        }
        // const status = await Status.findById(req.body.status)
        // if (!status) {
        //     return res.status(404).json({ error: 'status not found' })
        // }
        const province = await Province.findById(req.body.province)
        if (!province) {
            return res.status(404).json({ error: 'province not found' })
        }
        const district = await District.findById(req.body.district)
        if (!district) {
            return res.status(404).json({ error: 'district not found' })
        }
        console.log(district)
        const new_post = new Post({
            _id: mongoose.Types.ObjectId(),
            title: req.body.title,
            account: accountID,
            post_type: req.body.post_type,
            province: req.body.province,
            district: req.body.district,
            // status: req.body.status,
            price: req.body.price,
            square: req.body.square,
            address_detail: req.body.address,
            description: req.body.description,
            created_at: new Date(),
            updated_at: new Date()
        })
        new_post.save((err) => {
            if (err) {
                return res.status(500).json({ error: err })
            }
        })
        res.status(201).json({
            message: 'post created',
            post: new_post
        })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

module.exports.update_post = async (req, res, next) => {
    try {
        //kiem tra user co dang login hay ko
        const accountID = req.userData.accountId
        const account = await Account.findById(accountID)
        if (!account) {
            return res.status(404).json({ error: 'account not found' })
        }

        const id = req.params.postId
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({ error: 'post not found' })
        }

        const updateOps = {}
        for (const [key, value] of Object.entries(req.body)) {
            // console.log(key, value)
            updateOps[key] = value
        }

        if (updateOps.post_type) {
            const post_type = await Post_type.findById(req.body.post_type)
            if (!post_type) {
                return res.status(404).json({ error: 'post type not found' })
            }
        }
        // if (updateOps.status) {
        //     const status = await Status.findById(req.body.status)
        //     if (!status) {
        //         return res.status(404).json({ error: 'status not found' })
        //     }
        // }
        if (updateOps.province) {
            const province = await Province.findById(req.body.province)
            if (!province) {
                return res.status(404).json({ error: 'province not found' })
            }
        }
        if (updateOps.district) {
            const district = await District.findById(req.body.district)
            if (!district) {
                return res.status(404).json({ error: 'district not found' })
            }
        }
        //user nao` thi update post cua user do
        updateOps.updated_at = new Date()
        Post.updateMany({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'updated post',
                })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    } catch (err) {
        res.status(500).json({ error: err })

    }
}

module.exports.update_post_status = async (req, res, next) => {
    try {
        const accountID = req.userData.accountId
        const account = await Account.findById(accountID)
        if (!account) {
            return res.status(404).json({ error: 'account not found' })
        }

        const id = req.params.postId
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({ error: 'post not found' })
        }

        const updateOps = {}
        for (const [key, value] of Object.entries(req.body)) {
            updateOps[key] = value
        }

        updateOps.updated_at = new Date()
        Post.updateMany({ _id: id }, { $set: updateOps })
            .exec()
            .then(() => {
                res.status(200).json({
                    message: 'updated post status',
                })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    } catch (err) {
        res.status(500).json({ error: err })

    }
}

module.exports.delete_post = async (req, res, next) => {
    try {
        const accountID = req.userData.accountId
        const id = req.params.postId
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({ error: 'post not found' })
        }
        //xoa post cung dong thoi xoa transaction, xoa rate cua post do
        //xoa cac danh gia cua nguoi dung
        Rate.deleteMany({ post: id })
            .exec()
            .then(result => {

            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
        //xoa luon hop dong` dang ky lien quan toi post
        Transaction.deleteOne({ post: id })
            .exec()
            .then(() => {

            })
            .catch(err => {
                res.status(500).json({ error: err })
            })

        Post.deleteOne({ _id: id })
            .exec()
            .then(() => {
                res.status(200).json({
                    message: 'post deleted',
                })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })

    } catch (err) {
        res.status(500).json({ error: err })
    }
}

module.exports.get_a_post = async (req, res, next) => {
    // console.log(req.params.postId)
    try {
        await Post.aggregate(
            query_lookup_post({ _id: mongoose.Types.ObjectId(req.params.postId) })
        ).exec((err, result) => {
            if (result.length <= 0) {
                return res.status(404).json({
                    error: 'post not found'
                })
            }
            if (err) {
                res.status(500).json({
                    error: err
                })
            }

            res.status(200).json({
                count: result.length,
                posts: result,
            })
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.get_all_post = async (req, res, next) => {
    try {
        await Post.aggregate(
            query_lookup_post()
        ).exec((err, result) => {
            if (result.length <= 0) {
                return res.status(404).json({
                    error: 'post not found'
                })
            }
            if (err) {
                res.status(500).json({
                    error: err
                })
            }
            res.status(200).json({
                count: result.length,
                posts: result,
            })
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}


module.exports.get_all_post_pendding_or_posted = async (req, res, next) => {
    _status = null
    if (req.params.isposted) {
        if (req.params.isposted == 'true') {
            _status = true
        }
        if (req.params.isposted == 'false') {
            _status = false
        }
    }
    try {
        await Post.aggregate(
            query_lookup_post({ status: _status })
        ).exec((err, result) => {
            if (result.length <= 0) {
                return res.status(404).json({
                    error: 'post not found'
                })
            }
            if (err) {
                res.status(500).json({
                    error: err
                })
            }
            res.status(200).json({
                count: result.length,
                posts: result,
            })
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}


module.exports.get_all_post_with_options = async (req, res, next) => {
    select_option = {}
    if (req.params.typeId) {
        select_option.post_type = mongoose.Types.ObjectId(req.params.typeId)
    }
    if (req.params.accountId) {
        select_option.account = mongoose.Types.ObjectId(req.params.accountId)
    }
    try {
        await Post.aggregate(
            query_lookup_post(select_option)
        ).exec((err, result) => {
            if (result.length <= 0) {
                return res.status(404).json({
                    error: 'post not found'
                })
            }
            if (err) {
                res.status(500).json({
                    error: err
                })
            }
            res.status(200).json({
                count: result.length,
                posts: result,
            })
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

function query_lookup_post(options) {
    //dau vao la object dieu kien truy van
    op = options ? options : {}
    // console.log(op)
    return [
        { $match: op },
        {
            $lookup: {
                from: 'post_types',
                // localField: 'post_type',
                // foreignField: '_id',
                let: { post_type: "$post_type" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$$post_type", "$_id"] } } },
                    { $project: { deleted_at: 0 } }
                ],
                as: 'post_type'
            }
        },
        {
            $lookup: {
                from: 'users',
                let: { account: "$account" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$$account", "$account"] } } },
                    { $project: { _id: 0 } }
                ],
                as: 'user',
            }

        },
        {
            $lookup: {
                from: 'provinces',
                localField: 'province',
                foreignField: '_id',
                as: 'province',
            }

        },
        {
            $lookup: {
                from: 'districts',
                localField: 'district',
                foreignField: '_id',
                as: 'district',
            }
        },
        { $project: { account: 0 } }

    ]
}





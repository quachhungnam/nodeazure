const mongoose = require('mongoose')

const Post = require('../models/posts/post_model')
const Province = require('../models/province')
// const Status = require('../models/posts/status_model')
const District = require('../models/district')
const Post_type = require('../models/posts/post_type_model')
const Account = require('../models/account')
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
        Post.updateMany({ _id: id, account: accountID }, { $set: updateOps })
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

        Post.deleteOne({ _id: id, account: accountID })
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
    Post.findById(req.params.postId)
        .populate({ path: 'account', select: 'username' })
        .populate({ path: 'post_type', select: 'name' })
        .populate({ path: 'province', select: 'name' })
        .populate({ path: 'district', select: 'name' })
        .exec()
        .then(post => {
            if (!post) {
                return res.status(404).json({
                    error: 'post not found'
                })
            }
            // x= new Date()
            // console.log(x.Ut)
            res.status(200).json({
                post: post,
                // post_d: post.created_at.to
            })
        })
        .catch(err => {
            res.json({ error: err })
        })
}

module.exports.get_all_post = async (req, res, next) => {
    Post.find()
        // .select('title price')
        //  .populate('post_type','name')
        .populate({ path: 'account', select: 'username' })
        .populate({ path: 'post_type', select: 'name' })
        .populate({ path: 'province', select: 'name' })
        .populate({ path: 'district', select: 'name' })
        .exec()
        .then(docs => {
            // utcDate2 = new Date()
            // console.log(utcDate2.toLocaleString())
            res.status(200).json({
                posts: docs,
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

//get tat cac post dang cho` dang
module.exports.get_all_post_pendding = async (req, res, next) => {
    Post.find({ status: false })
        .populate({ path: 'account', select: 'username' })
        .populate({ path: 'post_type', select: 'name' })
        .populate({ path: 'province', select: 'name' })
        .populate({ path: 'district', select: 'name' })
        // .select('title price')
        //  .populate('post_type','name')
        .exec()
        .then(docs => {
            res.status(200).json({
                posts: docs,
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
//get tat ca post da dang
module.exports.get_all_post_is_posting = async (req, res, next) => {
    Post.find({ status: "true" })
        .populate({ path: 'account', select: 'username' })
        .populate({ path: 'post_type', select: 'name' })
        .populate({ path: 'province', select: 'name' })
        .populate({ path: 'district', select: 'name' })
        // .select('title price')
        //  .populate('post_type','name')
        .exec()
        .then(docs => {
            res.status(200).json({
                posts: docs,
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
}




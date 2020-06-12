const mongoose = require('mongoose')

const Post = require('../models/posts/post_model')
const Province = require('../models/province')
const Status = require('../models/posts/status_model')
const District = require('../models/district')
const Post_type = require('../models/posts/post_type_model')
const Account = require('../models/account')
const User = require('../models/user')
const Rate = require('../models/posts/rate_model')
const Transaction = require('../models/posts/transaction_model')

module.exports.add_post = async (req, res, next) => {
    try {
        //get ID_account trong token va kiem tra
        const host_id = req.userData.accountId
        const account = await Account.findById(host_id)
        if (!account) {
            return res.status(404).json({ error: 'account not found' })
        }
        const post_type = await Post_type.findById(req.body.post_type_id)
        if (!post_type) {
            return res.status(404).json({ error: 'post type not found' })
        }
        //mac dinh 
        const status = await Status.find({ code: 0 })
        if (status.length <= 0) {
            return res.status(404).json({ error: 'status not found' })
        }
        const province = await Province.findById(req.body.province_id)
        if (!province) {
            return res.status(404).json({ error: 'province not found' })
        }
        const district = await District.findById(req.body.district_id)
        if (!district) {
            return res.status(404).json({ error: 'district not found' })
        }
        // console.log(district)
        const new_post = new Post({
            _id: mongoose.Types.ObjectId(),
            title: req.body.title,
            host_id: host_id,
            post_type_id: req.body.post_type_id,
            province_id: req.body.province_id,
            district_id: req.body.district_id,
            status_id: status[0]._id,
            price: req.body.price,
            square: req.body.square,
            address_detail: req.body.address_detail,
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
        const host_id = req.userData.accountId
        const account = await Account.findById(host_id)
        if (!account) {
            return res.status(404).json({ error: 'account not found' })
        }

        const post_id = req.params.postId
        const post = await Post.findById(post_id)
        if (!post) {
            return res.status(404).json({ error: 'post not found' })
        }

        const updateOps = {}
        for (const [key, value] of Object.entries(req.body)) {
            // console.log(key, value)
            updateOps[key] = value
        }

        if (updateOps.post_type_id) {
            const post_type = await Post_type.findById(req.body.post_type_id)
            if (!post_type) {
                return res.status(404).json({ error: 'post type not found' })
            }
        }
        if (updateOps.status_code) {
            const status = await Status.find({ code: updateOps.status_code })
            if (status.length <= 0) {
                return res.status(404).json({ error: 'status not found' })
            }
            updateOps.status_id = status[0]._id
        }
        if (updateOps.province_id) {
            const province = await Province.findById(req.body.province_id)
            if (!province) {
                return res.status(404).json({ error: 'province not found' })
            }
        }
        if (updateOps.district_id) {
            const district = await District.findById(req.body.district_id)
            if (!district) {
                return res.status(404).json({ error: 'district not found' })
            }
        }

        updateOps.updated_at = new Date()
        Post.updateMany({ _id: post_id }, { $set: updateOps })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'updated post',
                })
            })
            .catch(err => {
                console.log(err)

                res.status(500).json({ error: err })
            })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })

    }
}

module.exports.update_post_status = async (req, res, next) => {
    try {
        const host_id = await req.userData.accountId
        const account = await Account.findById(host_id)
        if (!account) {
            return res.status(404).json({ error: 'account not found' })
        }

        const post_id = await req.params.postId
        const post = await Post.findById(post_id)
        if (!post) {
            return res.status(404).json({ error: 'post not found' })
        }

        const updateOps = {}
        for (const [key, value] of Object.entries(req.body)) {
            updateOps[key] = value
        }
        if (updateOps.status_code) {
            const status = await Status.find({ code: updateOps.status_code })
            if (status.length <= 0) {
                return res.status(404).json({ error: 'status not found' })
            }
            updateOps.status_id = status[0]._id
        }

        updateOps.updated_at = new Date()
        Post.updateMany({ _id: post_id }, { $set: updateOps })
            .exec()
            .then(() => {
                res.status(200).json({
                    message: 'updated status of post',
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
        // const accountID = req.userData.accountId
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
    try {
        const post_id = await req.params.postId
        const post = await Post.findById(post_id)
            .populate({ path: 'host_id', select: 'name' })
            .populate({ path: 'post_type_id', select: 'name' })
            .populate({ path: 'province_id', select: 'name' })
            .populate({ path: 'district_id', select: 'name' })
            .populate({ path: 'status_id', select: 'code description' })
        if (!post) {
            return res.status(404).json({
                error: 'post not found'
            })
        }
        res.status(200).json({
            post: post,
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.get_all_post = async (req, res, next) => {
    try {
        const post = await Post.find()
            .populate({ path: 'host_id', select: 'name' })
            .populate({ path: 'post_type_id', select: 'name' })
            .populate({ path: 'province_id', select: 'name' })
            .populate({ path: 'district_id', select: 'name' })
            .populate({ path: 'status_id', select: 'code description' })
        if (post.length <= 0) {
            return res.status(404).json({
                error: 'post not found'
            })
        }
        res.status(200).json({
            count: post.length,
            post: post,
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}


module.exports.get_all_post_with_status = async (req, res, next) => {
    try {
        const status_code = await req.params.code
        const status = await Status.find({ code: status_code })
        const post = await Post.find({ status_id: status[0]._id })
            .populate({ path: 'host_id', select: 'name' })
            .populate({ path: 'post_type_id', select: 'name' })
            .populate({ path: 'province_id', select: 'name' })
            .populate({ path: 'district_id', select: 'name' })
            .populate({ path: 'status_id', select: 'code description' })
        if (post.length <= 0) {
            return res.status(404).json({
                error: 'post not found'
            })
        }
        res.status(200).json({
            count: post.length,
            post: post,
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}


module.exports.get_all_post_with_options = async (req, res, next) => {

    try {
        option = {}
        if (req.params.typeId) {
            const post_type = await Post_type.findById(req.params.typeId)
            option.post_type_id = post_type._id
        }
        if (req.params.hostId) {
            const host_id = await Account.findById(req.params.hostId)
            option.host_id = host_id._id
        }

        const post = await Post.find(option)
            .populate({ path: 'host_id', select: 'name' })
            .populate({ path: 'post_type_id', select: 'name' })
            .populate({ path: 'province_id', select: 'name' })
            .populate({ path: 'district_id', select: 'name' })
            .populate({ path: 'status_id', select: 'code description' })
        if (post.length <= 0) {
            return res.status(404).json({
                error: 'post not found'
            })
        }
        res.status(200).json({
            count: post.length,
            post: post,
        })
    } catch (err) {
        // console.log(err)
        res.status(500).json({
            error: err
        })
    }
}




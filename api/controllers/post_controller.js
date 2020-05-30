const mongoose = require('mongoose')

const Post = require('../models/posts/post_model')
const Province = require('../models/province')
// const Status = require('../models/posts/status_model')
const District = require('../models/district')
const Post_type = require('../models/posts/post_type_model')
const Account = require('../models/account')

module.exports.add_post = async (req, res, next) => {
    try {
        const account = await Account.findById(req.body.account)
        if (!account) {
            return res.status(404).json({ error: 'user not found' })
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
            account: req.body.account,
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
        //neu 1 account cap nhat post
        if (updateOps.account) {
            const account = await Account.findById(req.body.account)
            if (!account) {
                return res.status(404).json({ error: 'account not found' })
            }
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
        const id = req.params.postId
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({ error: 'post not found' })
        }
        //kiem tra rate hay transaction??
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

module.exports.get_a_post = (req, res, next) => {
    // console.log(req.params.postId)
    Post.findById(req.params.postId)
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

module.exports.get_all_post = (req, res, next) => {
    // const status = req.body.p
    // console.log(status)
    Post.find()
        // .select('title price')
        //  .populate('post_type','name')
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
module.exports.get_all_post_pendding = (req, res, next) => {
    Post.find({ status: false })
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
module.exports.get_all_post_is_posting = (req, res, next) => {
    Post.find({ status: "true" })
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




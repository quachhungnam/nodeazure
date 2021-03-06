const mongoose = require('mongoose')
const Post_type = require('../models/posts/post_type_model')
const Post = require('../models/posts/post_model')

module.exports.add_post_type = async (req, res, next) => {
    try {
        const post_type = await Post_type.find({ name: req.body.name })
        if (post_type.length > 0) {
            return res.status(409).json({ error: 'post type exist' })
        }
        const new_post_type = new Post_type({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            description: req.body.description,
            created_at: new Date(),
            // updated_at: null,
        })
        new_post_type.save()
            .then(() => {
                res.status(201).json({
                    message: 'post type created'
                })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })

    } catch (err) {
        res.status(500).json({ error: err })
    }

}

module.exports.update_post_type = async (req, res, next) => {
    try {
        const post_type_id = req.params.posttypeId
        const post_type = await Post_type.findById(post_type_id)
        if (!post_type) {
            return res.status(404).json({ error: 'post type does not exist' })
        }
        const updateOps = {}
        for (const [key, value] of Object.entries(req.body)) {
            updateOps[key] = value
        }
        updateOps.updated_at = new Date()
        Post_type.updateMany({ _id: post_type_id }, { $set: updateOps })
            .exec()
            .then(() => {
                res.status(200).json({
                    message: 'updated post type',
                })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    } catch (err) {
        res.status(500).json({ error: err })
    }

}

module.exports.delete_post_type = async (req, res, next) => {
    //xoa post type can kiem tra tham chieu toi post
    try {
        const post_type_id = req.params.posttypeId
        const post_type = await Post_type.findById(post_type_id)
        if (!post_type) {
            return res.status(404).json({ error: 'post type does not exist' })
        }
        const post_ref = await Post.find({ post_type_id: post_type_id })
        //get all post have post_type=id
        if (post_ref.length > 0) {
            return res.status(500).json({
                error: 'can not delete this post type!'
            })
        }
        Post_type.deleteOne({ _id: post_type_id })
            .then(() => {
                res.status(200).json({ message: 'post type deleted' })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

module.exports.get_a_post_type = async (req, res, next) => {

    try {
        const post_type_id = await req.params.posttypeId
        const post_type = await Post_type.findById(post_type_id)
        if (!post_type) {
            return res.status(404).json({
                error: 'post type not found'
            })
        }
        res.status(200).json({
            post_type: post_type,
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.get_all_post_type = async (req, res, next) => {
    try {
        const post_type = await Post_type.find()
            .sort({ name: 'asc' })
        if (post_type.length <= 0) {
            return res.status(404).json({
                error: 'post type not found'
            })
        }
        res.status(200).json({
            count: post_type.length,
            post_type: post_type,
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}




const mongoose = require('mongoose')
const Rate = require('../models/posts/rate_model')
const Account = require('../models/account')
const Post = require('../models/posts/post_model')
//1 user danh' gia bai` post

module.exports.add_rate = async (req, res, next) => {
    try {
        const rate = await Rate.find({ user: req.body.user, post: req.body.post })
        if (rate.length > 0) {
            return res.status(409).json({ error: 'you must choose again your rate!' })
        }
        const account = await Account.findById(req.body.account)
        if (!account) {
            return res.status(409).json({ error: 'user does not exist' })
        }
        const post = await Post.findById(req.body.post)
        if (!post) {
            return res.status(409).json({ error: 'post does not exist' })
        }
        const new_rate = new Rate({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            account: req.body.account,
            post: req.body.post,
            description: req.body.description,
            start: req.body.star,
            created_at: new Date(),
            updated_at: new Date()
        })
        new_rate.save()
            .then((r) => {
                res.status(200).json({
                    message: 'rate created',
                    rate: r
                })
            }).catch(err => {
                res.status(500).json({ error: err })
            })

    } catch (err) {
        res.status(500).json({ error: err })
    }
}

module.exports.update_rate = async (req, res, next) => {
    try {
        const id = req.params.rateId
        const rate = await Rate.findById(id)
        if (!rate) {
            return res.status(404).json({ error: 'rate does not exist' })
        }
        const updateOps = {}
        for (const [key, value] of Object.entries(req.body)) {
            updateOps[key] = value
        }

        if (updateOps.user) {
            const account = await Account.findById(updateOps.account)
            if (!account) {
                return res.status(404).json({ error: 'user does not exist' })
            }
        }
        if (updateOps.post) {
            const post = await Post.findById(updateOps.post)
            if (!post) {
                return res.status(404).json({ error: 'post does not exist' })
            }
        }

        updateOps.updated_at = new Date()
        Rate.updateMany({ _id: id }, { $set: updateOps })
            .exec()
            .then(() => {
                res.status(200).json({
                    message: 'updated rate',
                })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })

    } catch (err) {
        res.status(500).json({ error: err })
    }

}

module.exports.delete_rate = async (req, res, next) => {
    try {
        const id = req.params.rateId
        const rate = await Rate.findById(id)
        if (!rate) {
            return res.status(404).json({ error: 'rate not found' })
        }
        Rate.deleteOne({ _id: id })
            .exec()
            .then(result => {
                // console.log(result)
                res.status(200).json({
                    message: 'rate deleted',
                })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

module.exports.get_a_rate = (req, res, next) => {
    Rate.findById(req.params.rateId)
        .exec()
        .then(rate => {
            if (!rate) {
                return res.status(200).json({
                    error: 'rate not found'
                })
            }
            res.status(200).json({
                rate: rate,
            })
        })
        .catch(err => {
            res.json({ error: err })
        })
}

module.exports.get_all_rate = (req, res, next) => {
    Rate.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                rates: docs,
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

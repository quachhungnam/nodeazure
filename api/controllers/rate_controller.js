const mongoose = require('mongoose')
const Rate = require('../models/posts/rate_model')
const Account = require('../models/account')
const Post = require('../models/posts/post_model')
//1 user danh' gia bai` post

module.exports.add_rate = async (req, res, next) => {
    try {
        //can tai khoan de danh gia
        const account_id = req.userData.accountId
        const account = await Account.findById(account_id)
        if (!account) {
            return res.status(404).json({ error: 'account does not exist' })
        }
        const post_id = req.body.post_id
        const post = await Post.findById(post_id)
        if (!post) {
            return res.status(404).json({ error: 'post does not exist' })
        }
        const rate = await Rate.find({ account: account_id, post: post_id })
        if (rate.length > 0) {
            return res.status(409).json({ error: 'you must choose again your rate!' })
        }

        const new_rate = new Rate({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            account_id: account_id,
            post_id: post_id,
            description: req.body.description,
            star: req.body.star,
            created_at: new Date(),
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
        console.log(err)
        res.status(500).json({ error: err })
    }
}

module.exports.update_rate = async (req, res, next) => {
    try {
        const accountID = req.userData.accountId
        const id = req.params.rateId
        const rate = await Rate.findById(id)
        if (!rate) {
            return res.status(404).json({ error: 'rate does not exist' })
        }
        const updateOps = {}
        for (const [key, value] of Object.entries(req.body)) {
            updateOps[key] = value
        }

        if (updateOps.post) {
            const post = await Post.findById(updateOps.post)
            if (!post) {
                return res.status(404).json({ error: 'post does not exist' })
            }
        }

        updateOps.updated_at = new Date()
        Rate.updateMany({ _id: id, account: accountID }, { $set: updateOps })
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
        const rate_id = req.params.rateId
        const rate = await Rate.findById(rate_id)
        if (!rate) {
            return res.status(404).json({ error: 'rate not found' })
        }
        Rate.deleteOne({ _id: rate_id })
            .exec()
            .then(result => {
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

module.exports.get_a_rate = async (req, res, next) => {
    try {
        const rate_id = await req.params.rateId
        const rate = await Rate.findById(rate_id)
            .populate({ path: 'post_id', select: 'title' })
            .populate({ path: 'account_id', select: 'username name' })

        if (!rate) {
            return res.status(404).json({
                error: 'rate not found'
            })
        }
        res.status(200).json({
            rate: rate,
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.get_all_rate = async (req, res, next) => {
    try {
        const rate = await Rate.find()
            .populate({ path: 'post_id', select: 'title' })
            .populate({ path: 'account_id', select: 'username name' })

        if (rate.length <= 0) {
            return res.status(404).json({
                error: 'rate is empty!'
            })
        }
        res.status(200).json({
            count: rate.length,
            rate: rate,
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

//1 post thi co nhieu danh gia
module.exports.get_all_rate_of_post = async (req, res, next) => {
    try {
        const post_id = req.params.postId
        // const post = await Post.findById(post_id)
        const rate = await Rate.find({ post_id: post_id })
            .populate({ path: 'post_id', select: 'title' })
            .populate({ path: 'account_id', select: 'username name' })

        if (rate.length <= 0) {
            return res.status(404).json({
                error: 'rate is empty!'
            })
        }
        res.status(200).json({
            count: rate.length,
            rate: rate,
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

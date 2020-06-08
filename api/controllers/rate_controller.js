const mongoose = require('mongoose')
const Rate = require('../models/posts/rate_model')
const Account = require('../models/account')
const Post = require('../models/posts/post_model')
//1 user danh' gia bai` post

module.exports.add_rate = async (req, res, next) => {
    try {
        //can tai khoan de danh gia
        const accountID = req.userData.accountId
        const account = await Account.findById(accountID)
        if (!account) {
            return res.status(404).json({ error: 'account does not exist' })
        }
        const rate = await Rate.find({ account: accountID, post: req.body.post })
        if (rate.length > 0) {
            return res.status(409).json({ error: 'you must choose again your rate!' })
        }
        const post = await Post.findById(req.body.post)
        if (!post) {
            return res.status(404).json({ error: 'post does not exist' })
        }
        const new_rate = new Rate({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            account: accountID,
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
        const accountID = req.userData.accountId
        // const account = await Account.findById(accountID)
        //nguoi nao` xoa rate nguoi` do'
        const id = req.params.rateId
        const rate = await Rate.findById(id)
        if (!rate) {
            return res.status(404).json({ error: 'rate not found' })
        }
        Rate.deleteOne({ _id: id, account: accountID })
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

module.exports.get_a_rate = async (req, res, next) => {
    try {
        const id = await req.params.rateId
        option = { _id: mongoose.Types.ObjectId(id) }
        await Rate.aggregate(
            query_lookup_rate(option)
        ).exec((err, result) => {
            if (result.length <= 0) {
                return res.status(404).json({
                    error: 'rate not found'
                })
            }
            if (err) {
                res.status(500).json({
                    error: err
                })
            }
            res.status(200).json({
                count: result.length,
                rate: result,
            })
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.get_all_rate = async (req, res, next) => {
    try {
        await Rate.aggregate(
            query_lookup_rate()
        ).exec((err, result) => {
            if (result.length <= 0) {
                return res.status(404).json({
                    error: 'rate not found'
                })
            }
            if (err) {
                res.status(500).json({
                    error: err
                })
            }
            res.status(200).json({
                count: result.length,
                rate: result,
            })
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
        const postId = await req.params.postId
        option = { post: mongoose.Types.ObjectId(postId) }
        await Rate.aggregate(
            query_lookup_rate(option)
        ).exec((err, result) => {
            if (result.length <= 0) {
                return res.status(404).json({
                    error: 'rate not found'
                })
            }
            if (err) {
                res.status(500).json({
                    error: err
                })
            }
            res.status(200).json({
                count: result.length,
                rate: result,
            })
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}


function query_lookup_rate(options) {
    //dau vao la object dieu kien truy van
    op = options ? options : {}
    // console.log(op)
    return [
        { $match: op },
        {
            $lookup: {
                from: 'accounts',
                let: { account: "$account" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$$account", "$_id"] } } },
                    {
                        $lookup: {
                            from: 'users',
                            let: { account: "$_id" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$$account", "$account"] } } },
                                { $project: { _id: 0, created_at: 0, created_by: 0 } }
                            ],
                            as: 'user',
                        }
                    },
                    { $project: { status: 0, password: 0, created_at: 0, created_by: 0, updated_at: 0 } }
                ],
                as: 'account',
            }
        },
        {
            $lookup: {
                from: 'posts',
                let: { post: "$post" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$$post", "$_id"] } } },
                    // {
                    //     $lookup: {
                    //         from: 'users',
                    //         let: { owner_post: "$account" },
                    //         pipeline: [
                    //             { $match: { $expr: { $eq: ["$$owner_post", "$account"] } } },
                    //             { $project: { _id: 0 } }
                    //         ],
                    //         as: 'owner_post',
                    //     }
                    // },
                    { $project: { post_type: 0, province: 0, district: 0, deleted_at: 0 } }
                ],
                as: 'post',
            }

        },
        // { $project: { account: 0 } }
    ]
}
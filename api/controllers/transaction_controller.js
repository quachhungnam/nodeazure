const mongoose = require('mongoose')

const Post = require('../models/posts/post_model')
const Account = require('../models/account')
const Transaction = require('../models/posts/transaction_model')

module.exports.add_transaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.find({ client: req.body.client, post: req.body.post })
        if (transaction.length > 0) {
            return res.status(409).json({ error: 'transaction exist' })
        }
        const client = await Account.findById(req.body.client)
        if (!client) {
            return res.status(409).json({ error: 'user does not exist' })
        }
        const post = await Post.findById(req.body.post)
        if (!post) {
            return res.status(409).json({ error: 'post does not exist' })
        }

        const new_transaction = new Transaction({
            _id: mongoose.Types.ObjectId(),
            client: req.body.client,
            post: req.body.post,
            // locked: false,
            created_at: new Date(),
            updated_at: new Date()
        })
        new_transaction.save()
            .then((transaction) => {
                res.status(201).json({
                    message: 'transaction created',
                    transaction: transaction
                })
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.update_transaction = async (req, res, next) => {
    try {
        const id = req.params.transactionId
        const transaction = Transaction.findById(id)
        if (!transaction) {
            return res.status(404).json({ error: 'transaction does not exist' })
        }
        const updateOps = {}
        for (const [key, value] of Object.entries(req.body)) {
            // console.log(key, value)
            updateOps[key] = value
        }
        if (updateOps.client) {
            const client = await Account.findById(req.body.client)
            if (!client) {
                return res.status(409).json({ error: 'client does not exist' })
            }
        }
        if (updateOps.post) {
            const post = await Post.findById(req.body.post)
            if (!post) {
                return res.status(409).json({ error: 'post does not exist' })
            }
        }

        Transaction.updateMany({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
                // console.log(result)
                res.status(200).json({
                    message: 'updated transaction',
                })
            })
            .catch(err => {
                // console.log(err)
                res.status(500).json({ error: err })
            })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

module.exports.delete_transaction = async (req, res, next) => {
    try {
        const id = req.params.transactionId
        const transaction = await Transaction.findById(id)
        if (!transaction) {
            return res.status(404).json({ error: 'transaction does not exist' })
        }
        Transaction.deleteOne({ _id: id })
            .exec()
            .then(() => {
                res.status(200).json({
                    message: 'transaction deleted',
                })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    } catch (err) {
        res.status(500).json({ error: err })
    }

}

module.exports.get_a_transaction = (req, res, next) => {
    Transaction.findById(req.params.transactionId)
        .exec()
        .then(transaction => {
            if (!transaction) {
                return res.status(404).json({
                    error: 'transaction not found'
                })
            }
            res.status(200).json({
                transaction: transaction
            })
        })
        .catch(err => {
            res.json({ error: err })
        })
}

module.exports.get_all_transaction = (req, res, next) => {
    Transaction.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                transactions: docs,
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


const mongoose = require('mongoose')
const Status = require('../models/posts/status_model')
const Post = require('../models/posts/post_model')

module.exports.add_status = async (req, res, next) => {
    try {
        const status = await Status.find({ name: req.body.code })
        if (status.length > 0) {
            return res.status(409).json({ error: 'status exist' })
        }
        const new_status = new Status({
            _id: mongoose.Types.ObjectId(),
            code: req.body.code,
            description: req.body.description,
            created_at: new Date(),
        })
        new_status.save()
            .then(() => {
                res.status(201).json({
                    message: 'status created'
                })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })

    } catch (err) {
        res.status(500).json({ error: err })
    }

}

module.exports.update_status = async (req, res, next) => {
    try {
        const status_id = await req.params.statusId
        const status = await Status.findById(status_id)
        if (!status) {
            return res.status(404).json({ error: 'status does not exist' })
        }
        const updateOps = {}
        for (const [key, value] of Object.entries(req.body)) {
            updateOps[key] = value
        }
        updateOps.updated_at = new Date()
        Status.updateMany({ _id: status_id }, { $set: updateOps })
            .exec()
            .then(() => {
                res.status(200).json({
                    message: 'updated status',
                })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    } catch (err) {
        res.status(500).json({ error: err })
    }

}

module.exports.delete_status = async (req, res, next) => {
    try {
        const status_id = req.params.statusId
        const status = await Status.findById(status_id)
        if (!status) {
            return res.status(404).json({ error: 'status does not exist' })
        }
        const post_ref = await Post.find({ status_id: status_id })
        //get all post have status=id
        if (post_ref.length > 0) {
            return res.status(500).json({
                error: 'can not delete this status!'
            })
        }

        Status.deleteOne({ _id: status_id })
            .then(() => {
                res.status(200).json({ message: 'status deleted' })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

module.exports.get_a_status = async (req, res, next) => {
    try {
        const status_id = req.params.statusId
        const status = await Status.findById(status_id)

        if (!status) {
            return res.status(404).json({
                error: 'status not found'
            })
        }
        res.status(200).json({
            status: status
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.get_all_status = async (req, res, next) => {
    try {
        const status = await Status.find()

        if (status.length <= 0) {
            return res.status(404).json({
                error: 'status is empty'
            })
        }
        res.status(200).json({
            count: status.length,
            statuses: status
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}




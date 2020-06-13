const mongoose = require("mongoose");

const Feedback = require("../models/feedback");
const Account = require("../models/account");

exports.feedbacks_get_all = (req, res, next) => {
  Feedback.find()
    .select(
      "_id account description status created_at created_by updated_at updated_by"
    )
    .populate("account", "name mobile email")
    .exec()
    .then((docs) => {
      res.status(200).json({
        success: true,
        data: {
          count: docs.length,
          feedbacks: docs.map((doc) => {
            return {
              _id: doc._id,
              account: doc.account,
              description: doc.description,
              status: doc.status,
              created_at: doc.created_at,
              created_by: doc.created_by,
              updated_at: doc.updated_at,
              updated_by: doc.updated_by,
              request: {
                type: "GET",
                url: "http://localhost:3000/feedbacks/" + doc._id,
              },
            };
          }),
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.feedbacks_create_feedback = (req, res, next) => {
  Account.findById(req.body.accountId)
    .then((account) => {
      if (!account) {
        return res.status(404).json({
          success: false,
          message: "Account not found",
        });
      }
      const feedback = new Feedback({
        _id: mongoose.Types.ObjectId(),
        account: req.body.accountId,
        description: req.body.description,
        status: req.body.status,
        created_at: new Date(),
        created_by: req.body.accountId,
        updated_at: null,
        update_by: null,
      });
      return feedback.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        success: true,
        message: "Feedback stored",
        createdFeedback: {
          _id: result._id,
          account: result.account,
          description: result.description,
          status: result.status,
          created_at: result.created_at,
          created_by: result.created_by,
          updated_at: result.updated_at,
          update_by: result.updated_by,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/feedbacks/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.feedbacks_get_feedback = (req, res, next) => {
  Feedback.findById(req.params.feedbackId)
    .select(
      "_id account description status created_at created_by updated_at updated_by"
    )
    .populate("account")
    .exec()
    .then((feedback) => {
      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found",
        });
      }
      res.status(200).json({
        success: true,
        feedback: feedback,
        request: {
          type: "GET",
          url: "http://localhost:3000/feedbacks",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.feedbacks_update_feedback = (req, res, next) => {
  Feedback.findById(req.params.feedbackId)
    .select("account")
    .populate("account")
    .exec()
    .then((feedback) => {
      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found",
        });
      }
      var accountId = feedback.account._id;
      const id = req.params.feedbackId;
      const updateOps = {};
      for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
      }
      updateOps.updated_at = new Date();
      updateOps.updated_by = accountId;
      Feedback.update({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
          res.status(200).json({
            success: true,
            message: "Feedback updated",
            request: {
              type: "GET",
              url: "http://localhost:3000/feedbacks/" + id,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.feedbacks_delete_feedback = (req, res, next) => {
  Feedback.remove({ _id: req.params.feedbackId })
    .exec()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Feedback deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/feedbacks",
          body: { accountId: "ID", description: "String" },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

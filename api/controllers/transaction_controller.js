const mongoose = require("mongoose");

const Post = require("../models/posts/post_model");
const Account = require("../models/account");
const Transaction = require("../models/posts/transaction_model");
const Status = require("../models/posts/status_model");

module.exports.add_transaction = async (req, res, next) => {
  try {
    const client_id = req.userData.accountId;
    const account = await Account.findById(client_id);
    if (!account) {
      return res.status(404).json({ error: "account not found" });
    }
    const post_id = req.body.post_id;
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: "post does not exist" });
    }
    const transaction = await Transaction.find({
      client_id: client_id,
      post_id: post_id,
    });
    if (transaction.length > 0) {
      return res.status(409).json({ error: "transaction exist" });
    }
    const new_transaction = new Transaction({
      _id: mongoose.Types.ObjectId(),
      client_id: client_id,
      post_id: post_id,
      // locked: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    new_transaction
      .save()
      .then((transaction) => {
        res.status(201).json({
          message: "transaction created",
          transaction: transaction,
        });
        // khi 1 transaction duoc tao ra thi post status cung thay doi sang 2: da dat cho
        change_status_post(post_id, 2);
      })
      .catch((err) => {
        return res.status(500).json({
          error: err,
        });
      });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

module.exports.update_transaction = async (req, res, next) => {
  try {
    //thuc ra checkauth ròi khoi check cung duoc
    const client_id = req.userData.accountId;
    const account = await Account.findById(client_id);
    if (!account) {
      return res.status(404).json({ error: "account not found" });
    }

    const transaction_id = req.params.transactionId;
    const transaction = Transaction.findById(transaction_id);
    if (!transaction) {
      return res.status(404).json({ error: "transaction does not exist" });
    }
    const updateOps = {};
    for (const [key, value] of Object.entries(req.body)) {
      // console.log(key, value)
      updateOps[key] = value;
    }

    if (updateOps.post_id) {
      const post = await Post.findById(updateOps.post_id);
      if (!post) {
        return res.status(404).json({ error: "post does not exist" });
      }
    }

    Transaction.updateMany({ _id: transaction_id }, { $set: updateOps })
      .exec()
      .then((result) => {
        // console.log(result)
        res.status(200).json({
          message: "updated transaction",
        });
      })
      .catch((err) => {
        // console.log(err)
        res.status(500).json({ error: err });
      });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports.delete_transaction = async (req, res, next) => {
  try {
    const transaction_id = req.params.transactionId;
    const transaction = await Transaction.findById(transaction_id);
    if (!transaction) {
      return res.status(404).json({ error: "transaction does not exist" });
    }
    const post_id = transaction.post_id;
    Transaction.deleteOne({ _id: transaction_id })
      .exec()
      .then(() => {
        res.status(200).json({
          message: "transaction deleted",
        });
        change_status_post(post_id, 1);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports.get_a_transaction = async (req, res, next) => {
  try {
    const transaction_id = await req.params.transactionId;
    const transaction = await Transaction.findById(transaction_id)
      .populate({
        path: "post_id",
        select: "title status_id host_id",
        populate: {
          path: "status_id host_id",
          select: "username name code description",
        },
      })
      .populate({ path: "client_id", select: "username name" });

    if (!transaction) {
      return res.status(404).json({
        error: "transaction not found",
      });
    }
    res.status(200).json({
      transaction: transaction,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

module.exports.get_all_transaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.find()
      .populate({
        path: "post_id",
        select:
          "title price status_id host_id post_type_id district_id province_id",
        populate: {
          path: "status_id host_id post_type_id district_id province_id",
          select: "username name code description name_with_type",
        },
      })
      .populate({ path: "client_id", select: "username name" });

    if (transaction.length <= 0) {
      return res.status(404).json({
        error: "transaction is empty",
      });
    }
    res.status(200).json({
      count: transaction.length,
      transaction: transaction,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

async function change_status_post(post_id, new_status_code) {
  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return { error: "post not found" };
    }
    const status = await Status.find({ code: new_status_code });
    if (status.length <= 0) {
      return { error: "status not found" };
    }
    Post.updateMany({ _id: post_id }, { $set: { status_id: status[0]._id } })
      .exec()
      .then(() => {
        return { message: "success" };
      });
  } catch (err) {
    return { error: err };
  }
}

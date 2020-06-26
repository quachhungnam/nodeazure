const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Account = require("../models/account");
const Rate = require("../models/posts/rate_model");
const Post = require("../models/posts/post_model");
const Transaction = require("../models/posts/transaction_model");
const Feedback = require("../models/feedback");

exports.accounts_get_all = (req, res, next) => {
  Account.find()
    .populate({ path: "idRole", select: "name _id" })
    .select(
      "_id username password status name email avatar mobile address created_at created_by updated_at updated_by"
    )
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        accounts: docs.map((doc) => {
          return {
            _id: doc._id,
            username: doc.username,
            password: doc.password,
            status: doc.status,
            name: doc.name,
            email: doc.email,
            avatar: doc.avatar,
            mobile: doc.mobile,
            address: doc.address,
            created_at: doc.created_at,
            created_by: doc.created_by,
            updated_at: doc.updated_at,
            updated_by: doc.updated_by,
            request: {
              type: "GET",
              url: "http://localhost:3000/accounts/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json({
        success: true,
        data: response,
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

exports.accounts_get_account = (req, res, next) => {
  const id = req.userData.accountId || req.params.accountId;
  Account.findById(id)
    .select(
      "_id username password status name email avatar mobile address created_at created_by updated_at updated_by"
    )
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          success: true,
          data: {
            account: doc,
            request: {
              type: "GET",
              url: "http://localhost:3000/accounts",
            },
          },
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No valid entry found for provided ID",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.account_create_account = (req, res, next) => {
  Account.find({ username: req.body.username })
    .exec()
    .then((account) => {
      // user array
      if (account.length >= 1) {
        return res.status(409).json({
          success: false,
          message: "Username exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              success: false,
              error: err,
            });
          } else {
            var accountId = new mongoose.Types.ObjectId();
            const account = new Account({
              _id: accountId,
              username: req.body.username,
              password: hash,
              status: req.body.status,
              name: req.body.name,
              email: req.body.email,
              mobile: req.body.mobile,
              address: req.body.address,
              idRole: req.body.idRole,
              created_at: new Date(),
              created_by: accountId,
              updated_at: null,
              update_by: null,
            });
            account
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  success: true,
                  message: "Account created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  success: false,
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.account_signup = (req, res, next) => {
  Account.find({ username: req.body.username })
    .exec()
    .then((account) => {
      // user array
      if (account.length >= 1) {
        return res.status(409).json({
          success: false,
          message: "Username exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              success: false,
              error: err,
            });
          } else {
            var accountId = new mongoose.Types.ObjectId();
            const account = new Account({
              _id: accountId,
              username: req.body.username,
              password: hash,
              status: req.body.status,
              name: req.body.name,
              email: req.body.email,
              mobile: req.body.mobile,
              address: req.body.address,
              idRole: new mongoose.Types.ObjectId("5eeff606fd30b42ca0d836e3"),
              created_at: new Date(),
              created_by: accountId,
              updated_at: null,
              update_by: null,
            });
            account
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  success: true,
                  message: "Account created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  success: false,
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.account_login = (req, res, next) => {
  Account.find({ username: req.body.username })
    .exec()
    .then((account) => {
      if (account.length < 1) {
        return res.status(409).json({
          success: false,
          message: "Username does not exist",
        });
      }
      if (account[0].status == true) {
        bcrypt.compare(
          req.body.password,
          account[0].password,
          (err, result) => {
            if (err) {
              return res.status(404).json({
                success: false,
                message: "Auth failed",
              });
            }
            if (result) {
              const token = jwt.sign(
                {
                  username: account[0].username,
                  accountId: account[0]._id,
                },
                process.env.JWT_KEY || "Secrect",
                {
                  expiresIn: "1h",
                }
              );
              return res.status(200).json({
                success: true,
                message: "Auth successful",
                _id: account[0]._id,
                token: token,
              });
            }
            res.status(409).json({
              success: false,
              message: "Password is wrong",
            });
          }
        );
      } else {
        res.status(409).json({
          success: false,
          message: "This account was locked",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.accounts_update_account = (req, res, next) => {
  const id = req.params.accountId;
  const updateOps = {};
  for (const [key, value] of Object.entries(req.body)) {
    updateOps[key] = value;
  }
  updateOps.updated_at = new Date();
  updateOps.updated_by = id;
  Account.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Account updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/accounts/" + id,
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

exports.accounts_check_account_password = (req, res, next) => {
  Account.find({ _id: req.params.accountId })
    .exec()
    .then((account) => {
      if (account.length < 1) {
        return res.status(404).json({
          success: false,
          message: "Account not found",
        });
      } else {
        bcrypt.compare(
          req.body.password,
          account[0].password,
          (err, result) => {
            if (err) {
              return res.status(404).json({
                success: false,
                message: "Wrong password",
              });
            }
            if (result) {
              return res.status(200).json({
                success: true,
                message: "Right password",
              });
            }
            res.status(404).json({
              success: false,
              message: "Wrong password",
            });
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.accounts_update_account_password = (req, res, next) => {
  const id = req.params.accountId;
  const updateOps = {};
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    updateOps.password = hash;
    updateOps.updated_at = new Date();
    updateOps.updated_by = id;
    Account.updateMany({ _id: id }, { $set: updateOps })
      .exec()
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "Account password updated",
          request: {
            type: "GET",
            url: "http://localhost:3000/accounts/" + id,
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
  });
};

exports.accounts_update_account_status = (req, res, next) => {
  const id = req.params.accountId;
  const updateOps = {
    status: req.body.status,
  };
  updateOps.updated_at = new Date();
  updateOps.updated_by = id;
  Account.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Account status updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/accounts/" + id,
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

exports.accounts_update_account_avatar = (req, res, next) => {
  const id = req.params.accountId;
  const updateOps = {
    avatar: req.files[0].path.replace("\\", "/"),
  };
  updateOps.updated_at = new Date();
  updateOps.updated_by = id;
  Account.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Account avatar updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/accounts/" + id,
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

exports.accounts_delete_account = async (req, res, next) => {
  const id = req.params.accountId;
  Account.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Account deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    });

  // xoa nhung cai lien quan

  Feedback.deleteMany({ account: id })
    .exec()
    .then(() => {})
    .catch((err) => {
      res.status(500).json({ error: err });
    });

  const post = await Post.find({ host_id: id });
  if (!post) {
    return res.status(404).json({ error: "post not found" });
  }
  for (let i = 0; i < post.length; i++) {
    Rate.deleteOne({ post_id: post[i]._id })
      .exec()
      .then((result) => {})
      .catch((err) => {
        res.status(500).json({ error: err });
      });
    Transaction.deleteOne({ post_id: post[i]._id })
      .exec()
      .then(() => {})
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

  Post.deleteMany({ host_id: id })
    .exec()
    .then(() => {})
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.get_account_from_token = (req, res, next) => {
  const id = req.userData.accountId;
  Account.findById(id)
    .select(
      "_id username password status name email avatar mobile address created_at created_by updated_at updated_by"
    )
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          success: true,
          data: {
            account: doc,
            request: {
              type: "GET",
              url: "http://localhost:3000/accounts",
            },
          },
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No valid entry found for provided ID",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

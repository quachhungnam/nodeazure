const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    required: true,
  },
  avatar: {
    type: String,
    default: "uploads/avatar.png",
  },
  mobile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  idRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  created_at: {
    type: Date,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
  },
  updated_at: {
    type: Date,
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("Account", accountSchema);

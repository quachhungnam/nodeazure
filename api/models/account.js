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

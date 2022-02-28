const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  user_name: {

    type: String,

    required: "please enter a userName",

    trim: true,

    unique: true,
  },

  created_at: { type: String },

});

module.exports = mongoose.model("User", userSchema);

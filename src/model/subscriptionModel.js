const mongoose = require("mongoose");

//const subsPlan = require("../configs/subsPlan.js");


const subsSchema = new mongoose.Schema({
  user_name: {
    type: String,
    refs: "User",
    required: "Enter the user name",
    trim: true,
  },
  plan_id: {
    type: String,
    required: "Enter a plan Id",
    enum: ["FREE", "TRIAL", "LITE_1M", "PRO_1M", "LITE_6M", "PRO_6M"],
    trim: true,
  },
  start_date: {
    type: String,
    required: true,
    trim: true,
  },
  valid_upto: {
    type: String,
  },
});

module.exports = mongoose.model("subscription", subsSchema);

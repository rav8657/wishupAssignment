const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: "Enter the user name",
    trim: true,
  },
  plan_id: {
    type: String,
    required: "Enter a plan Id",
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

module.exports = mongoose.model("subscription", subscriptionSchema);

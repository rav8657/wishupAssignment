const userModel = require("../model/userModel");
const subscriptionModel = require("../model/subscriptionModel");
const validator = require("../utils/validator");
const planId = ["FREE", "TRIAL", "LITE_1M", "PRO_1M", "LITE_6M", "PRO_6M"]
const planValidity = ['infinite', 7, 30, 30, 180, 180]
const planCost = [0, 0, 100, 200, 500, 900]


// Purchasing a plan by providing userName, choosing planId & selecting start-Date  
const createSubscription = async function (req, res) {
  try {
    let requestBody = req.body;

    //validate request body
    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, msg: "request body is required" });
    }
    //destructuring the params
    const { user_name, plan_id, start_date } = requestBody;

    //validation for the user credentials
    if (!validator.isValid(user_name)) {
      return res.status(400).send({ status: false, msg: "User Name is required" });
    }
    //validation for choosing a planId
    if (!validator.isValid(plan_id)) {
      return res.status(400).send({ status: false, msg: "planId is required" });
    }

    if (!validator.isValidPlanId(plan_id)) {
      return res.status(400).send({ status: false, msg: "Please select a valid planId" });
    }
    //validation for choosing a start-Date
    if (!validator.isValid(start_date)) {
      return res.status(400).send({ status: false, msg: "Start Date is required" });
    }
    if (!validator.isValidStartDate(start_date)) {
      return res.status(400).send({ status: false, message: "Please provide valid date in format of YYYY-MM-DD" })
    }

    //searching user to check whether they are an existing user or not.
    const isUserPresent = await userModel.findOne({ user_name });

    if (!isUserPresent) {
      return res.status(404).send({ status: false, msg: "User not present, please check the user name." })
    }
    // operation for calculating the amount deduction
    let planIndex = planId.indexOf(plan_id)
    const amount = planCost[planIndex]

    const newSubscription = { user_name, plan_id, start_date };
    const createSubscription = await subscriptionModel.create(newSubscription);  //saving Subscription details in Database


    if (createSubscription) {
      return res.status(200).send({ status: true, msg: `Amount: -${amount} debited` });
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};



//!..................................................................................

// featching subscription details from Database.
const getSubscription = async (req, res) => {
  try {
    const requestParams = req.params

    const { user_name } = requestParams

    //searching user to check whether they are an existing user or not.
    const findUser = await userModel.findOne({ user_name: user_name })
    if (!findUser) {
      return res.status(404).send({ status: false, message: `${user_name} not present` })
    }
    // checking whether the user is having any active subscription or not
    const findSubscription = await subscriptionModel.find({ user_name: user_name })
    if (findSubscription.length === 0) {
      return res.status(404).send({ status: false, message: `No active subcription for this ${user_name} ` })
    }

    //operations to caclulate subscription validity
    let validSubscription = []

    for (let i in findSubscription) {
      const start_date = findSubscription[i].start_date
      const newDate = new Date(`${start_date} 00:00:00`);   //newdate convert into dateformat.
      const convertToMilliseconds = newDate.getTime();

      if (findSubscription[i].plan_id === 'FREE') {        //If subscription is free than plane go to infinte.

        let responseObject = {
          plan_id: findSubscription[i].plan_id,
          start_date: findSubscription[i].start_date,
          valid_upto: 'infinite'
        }
        validSubscription.push(responseObject)
      } else {
        const planIndex = planId.indexOf(findSubscription[i].plan_id)
        const validDays = planValidity[planIndex]                  // checking validDays
        const remainingDays = (validDays * 24 * 60 * 60 * 1000) + convertToMilliseconds  //checking remainingDays & converting date-time into Milliseconds

        const valid_upto = new Date(remainingDays).toLocaleDateString()    // toLocaleDateString convert it in a given format
        let splitDate = valid_upto.split('/')

        const responseObject = {
          plan_id: findSubscription[i].plan_id,                              // changing valid upto validity
          start_date: findSubscription[i].start_date,
          valid_upto: `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`
        }
        validSubscription.push(responseObject)
      }

    }
    return res.status(200).send({ status: "Success", data: validSubscription })
  } catch (error) {
    return res.status(500).send({ status: "False", msg: error.message })
  }
};

module.exports = {
  createSubscription,
  getSubscription,
};

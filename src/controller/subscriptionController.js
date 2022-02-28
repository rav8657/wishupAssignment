const userModel = require("../model/userModel");
const subscriptionModel = require("../model/subscriptionModel");
const validator = require("../utils/validator");
// const moment = require("moment")

const plan_id = ["FREE", "TRIAL", "LITE_1M", "PRO_1M", "LITE_6M", "PRO_6M"]
const planValidity = ['infinite', 7, 30, 30, 180, 180]
const planCost = [0, 0, 100, 200, 500, 900]


const createSubscription = async function (req, res) {
  try {
    let requestBody = req.body;
    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, msg: "request body is required" });
    }

    const { user_name, plan_id, start_date } = requestBody;

    if (!validator.isValid(user_name)) {
      return res.status(400).send({ status: false, msg: "User Name is required" });
    }

    if (!validator.isValid(plan_id)) {
      return res.status(400).send({ status: false, msg: "Plan Id is required" });
    }

    if (!validator.isValidPlanId(plan_id)) {
      return res.status(400).send({ status: false, msg: "Please select a valid Plan Id" });
    }

    if (!validator.isValid(start_date)) {
      return res.status(400).send({ status: false, msg: "Start Date is required" });
    }

    const isUserPresent = await userModel.findOne({ user_name });

    if (!isUserPresent) {
      return res.status(404).send({ status: false, msg: "User not present, please check the user name." })
    }

    let index = plan_id.indexOf(plan_id)

    const amount = planCost[index]

    const newSubscription = { user_name, plan_id, start_date };
    const createSubscription = await subscriptionModel.create(newSubscription);


    if (createSubscription) {
      return res.status(200).send({ status: true, msg: `Amount: -${amount} debited` });
    }

  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};







const getSubscription = async (req, res) => {
  try {
    const requestParams = req.params

    const { user_name } = requestParams

    const findUser = await userModel.findOne({ user_name: user_name })

    if (!findUser) {
      return res.status(404).send({ status: false, message: `${user_name} not present` })
    }

    const findSubscription = await subscriptionModel.find({ user_name: user_name })

    if (findSubscription.length === 0) {
      return res.status(404).send({ status: false, message: `No active subcription for this ${user_name} ` })
    }

    let validSubscription = []

    for (let i = 0; i < findSubscription.length; i++) {
      if (findSubscription[i].plan_id === 'FREE') {

        let obj = {
          plan_id: findSubscription[i].plan_id,
          start_date: findSubscription[i].start_date,
          valid_upto: 'infinite'
        }
        validSubscription.push(obj)
      }
      const start_date = findSubscription[i].start_date
      const newDate = new Date(`${start_date} 00:00:00`);
      const convertToMilliseconds = newDate.getTime();


      let planIndex = plan_id.indexOf(findSubscription[i].plan_id)

      const validDays = planValidity[planIndex]

      const remainingDays = (validDays * 24 * 60 * 60 * 1000) + convertToMilliseconds


      if (remainingDays > Date.now()) {

        const valid_upto = new Date(remainingDays).toLocaleDateString()
        let arr = valid_upto.split('/')

        const obj = {
          plan_id: findSubscription[i].plan_id,
          start_date: findSubscription[i].start_date,
          valid_upto: `${arr[2]}-${arr[1]}-${arr[0]}`
        }
        validSubscription.push(obj)
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

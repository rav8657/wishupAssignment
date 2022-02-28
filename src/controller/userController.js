const  userModel  = require("../model/userModel");
const moment = require("moment")




const createUser = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    const UserAlreadyPresent = await userModel.findOne({ user_name });

    if (UserAlreadyPresent) {
      return res.status(400).send({ status: "False", msg: ` ${user_name} already taken, choose a new one` });
    }
    await userModel.create({ user_name });
    const response = { user_name: user_name, created_at: moment().format("YYYY-MM-DD HH:mm:ss") }
    return res.status(201).send({ status: "Success", data: response });

  } catch (error) {
    return res.status(500).send({ status: "False", msg: error.message })
  }
};






const getUser = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    let user = await userModel.findOne({ user_name }, { _id: 0, __v: 0 });

    if (!user) {
      return res.status(404).send({ status: "False", msg: ` ${user_name} has not registered yet` })}
  
    user.created_at = moment(user.created_at).format("YYYY-MM-DD HH:mm:ss")

    return res.status(200).send({ status: "Success", data: user });
  } catch (error) {
    res.status(500).send({ status: "FAILURE", msg: error.message });
  }
};

module.exports = {
  createUser,
  getUser,
};

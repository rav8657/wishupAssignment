const  userModel  = require("../model/userModel");
const dateTime = require("date-and-time")

//* Registering user
const createUser = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    //*checking whether user already Present  or not
    const UserAlreadyPresent = await userModel.findOne({ user_name });

    if (UserAlreadyPresent) {
      return res.status(400).send({ status: "False", msg: ` ${user_name} already taken, choose a new one` });
    }
     await userModel.create({ user_name,created_at: dateTime.format(new Date(),"YYYY-MM-DD HH:mm" ) });

    const response = {user_name ,created_at: dateTime.format(new Date(),"YYYY-MM-DD HH:mm" )}

    return res.status(201).send({ status: "Success", data: response });

  } catch (error) {
    return res.status(500).send({ status: "False", msg: error.message })
  }
};


//!....................................................................................
//*Fetching user details

const getUser = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    let findUser = await userModel.findOne({ user_name }, { _id: 0, __v: 0 });

    if (!findUser) {
      return res.status(404).send({ status: "False", msg: ` ${user_name} has not registered yet` })}
  
    return res.status(200).send({ status: "Success", data: findUser });
  } catch (error) {
    res.status(500).send({ status: "False", msg: error.message });
  }
};

module.exports = {
  createUser,
  getUser,
};

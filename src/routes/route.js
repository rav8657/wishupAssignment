const express = require('express')
const router = express.Router()


const userController = require("../controller/userController");



router.put("/user/:user_name", userController.createUser);
router.get("/user/:user_name", userController.getUser);


module.exports = router;







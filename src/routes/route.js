const express = require('express')
const router = express.Router()


const userController = require("../controller/userController");
const subscriptionController = require("../controller/subscriptionController");

//*...... User APIs
router.put("/user/:user_name", userController.createUser);
router.get("/user/:user_name", userController.getUser);

//*...... Subscription APIs
router.post("/subscription", subscriptionController.createSubscription);
router.get("/subscription/:user_name", subscriptionController.getSubscription);



module.exports = router;
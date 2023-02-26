const Router = require("express");
const router = new Router();
const authController = require("../controllers/authController");

router.post("/signin", authController.signIn);
router.post("/signup", authController.signUp);

module.exports = router;
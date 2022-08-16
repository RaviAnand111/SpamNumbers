const userController = require("../controllers/userController")
const checkLogin = require("../middleware/checkLogin");
const router = require("express").Router();

// Register New User
router.post("/register", userController.register);

// User Login
router.post("/login", userController.login);

// Mark Spam
router.post("/markSpam", checkLogin, userController.markSpam)

// Search
router.post("/search", checkLogin, userController.search)

module.exports = router
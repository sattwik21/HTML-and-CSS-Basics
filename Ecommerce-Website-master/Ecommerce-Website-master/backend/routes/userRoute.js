const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetpassword, getUserDetails, updatePassowrd, updateProfile, getAllUser, getsingleUser, updateUserRole, deleteUserProfile } = require("../controllers/userController");
const { isAuthenticated, autherizeRoles } = require("../middleware/auth");
const { route } = require("./productRute");
const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetpassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated,getUserDetails)

router.route("/password/update").put(isAuthenticated, updatePassowrd)

router.route("/me/update").put(isAuthenticated, updateProfile)

router.route("/admin/users").get(isAuthenticated, autherizeRoles("Admin"), getAllUser);

router
.route("/admin/user/:id")
.get(isAuthenticated,autherizeRoles("Admin"), getsingleUser)
.put(isAuthenticated,autherizeRoles("Admin"),updateUserRole)
.delete(isAuthenticated,autherizeRoles("Admin"),deleteUserProfile);



module.exports = router;
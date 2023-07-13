const express = require("express");
const { registerUser,loginUser,logout, forgotpassword,resetPasswords,getuserdetails, updatepass, updateprofile, getallusers, getsingleuser, deleteuser, updaterole} = require("../controllers/usercontroller");
const{isAuthenticatedUser,authorizedroles}=require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotpassword);
router.route("/password/reset/:token").put(resetPasswords);
router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser,getuserdetails);
router.route("/password/update").put(isAuthenticatedUser,updatepass);
router.route("/me/update").put(isAuthenticatedUser,updateprofile);
router.route("/admin/users").get(isAuthenticatedUser,authorizedroles("admin"),getallusers);
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizedroles("admin"),getsingleuser);
router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizedroles("admin"),deleteuser);
router.route("/admin/user/:id").put(isAuthenticatedUser,authorizedroles("admin"),updaterole);

module.exports=router;

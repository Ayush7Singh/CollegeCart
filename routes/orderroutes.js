const express=require("express");
const router=express.Router();
const{isAuthenticatedUser,authorizedroles}=require("../middleware/auth");
const { newOrder, getsingleorder, myorder, allorders, updateorder, deleteorder } = require("../controllers/ordercontrollers");


router.route("/order/new").post(isAuthenticatedUser,newOrder);
router.route("/order/:id").get(isAuthenticatedUser,getsingleorder);
router.route("/orders/me").get(isAuthenticatedUser,myorder);
router.route("/admin/orders").get(isAuthenticatedUser,authorizedroles("admin"),allorders);
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizedroles("admin"),updateorder).delete(isAuthenticatedUser,authorizedroles("admin"),deleteorder);


module.exports=router;
const express = require("express");
const { getallproducts,updateProduct,createProduct,deleteProduct,getsingleproduct, createproductreview, getproductreview, deletereview, allAdminProducts } = require("../controllers/productcontrollers");
const { isAuthenticatedUser,authorizedroles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get( getallproducts);

router.route("/admin/product/new").post(isAuthenticatedUser,authorizedroles("admin"),createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizedroles("admin"),updateProduct).delete(isAuthenticatedUser,authorizedroles("admin"),deleteProduct)
router.route("/admin/products").get(isAuthenticatedUser,authorizedroles("admin"),allAdminProducts);
router.route("/review").put(isAuthenticatedUser,createproductreview);
router.route("/reviews").get(getproductreview);
router.route("/product/:id").get(getsingleproduct);
router.route("/reviews").delete(isAuthenticatedUser,deletereview);


module.exports = router;
const express = require("express");
const { getAllproducts, createProduct,updateProduct,deleteProduct,getProductDetails, createProductReview, getproductREviews, deleteReviews, } = require("../controllers/productController");
const { isAuthenticated,autherizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(  getAllproducts)
router.route("/admin/products/new").post(isAuthenticated,autherizeRoles("Admin"),createProduct)

router.route("/admin/products/:id")
.put(isAuthenticated,autherizeRoles("Admin"),updateProduct)
.delete(isAuthenticated,autherizeRoles("Admin"),deleteProduct)
.get(getProductDetails);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticated, createProductReview);

router.route("/reviews").get(getproductREviews).delete(isAuthenticated, deleteReviews)

module.exports = router

const express = require("express");
const { newOrder, getSingleOrder, myOrder, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const router = express.Router();
const { isAuthenticated,autherizeRoles } = require("../middleware/auth");


router.route("/order/new").post(isAuthenticated,newOrder);

router.route("/order/:id").get(isAuthenticated,getSingleOrder);
router.route("/orders/me").get(isAuthenticated,myOrder);

router.route("/admin/orders").get(isAuthenticated, autherizeRoles("Admin"),getAllOrders);
router
.route("/admin/order/:id")
.put(isAuthenticated, autherizeRoles("Admin"),updateOrder)
.delete(isAuthenticated, autherizeRoles("Admin"),deleteOrder);

module.exports = router;
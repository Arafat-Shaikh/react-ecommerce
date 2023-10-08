const express = require("express");
const {
  createOrder,
  fetchOrdersByUser,
  fetchOrdersByFilter,
  updateOrder,
  deleteOrder,
  fetchUserOrdersByAdmin,
} = require("../controller/Order");
const router = express.Router();

router
  .post("/", createOrder)
  .get("/user", fetchOrdersByUser)
  .get("/", fetchOrdersByFilter)
  .patch("/:id", updateOrder)
  .delete("/:id", deleteOrder)
  .get("/admin/:id", fetchUserOrdersByAdmin);

exports.router = router;

const express = require("express");
const {
  addToCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  deleteAllItems,
} = require("../controller/Cart");
const router = express.Router();

router
  .post("/", addToCart)
  .get("/", getCartByUserId)
  .patch("/:id", updateCartItem)
  .delete("/:id", deleteCartItem)
  .delete("/", deleteAllItems);

exports.router = router;

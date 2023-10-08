const express = require("express");
const {
  createNewProduct,
  fetchFilteredProducts,
  fetchProductById,
  fetchAllProducts,
  editProduct,
} = require("../controller/Product");
const router = express.Router();

router
  .get("/", fetchFilteredProducts)
  .get("/detail/:id", fetchProductById)
  .get("/filter", fetchAllProducts)
  .post("/", createNewProduct)
  .patch("/:id", editProduct);
exports.router = router;

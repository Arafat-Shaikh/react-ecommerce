const express = require("express");
const {
  updateUser,
  fetchUserById,
  fetchAllUsersInfo,
  updateAdminUser,
  adminDeleteUser,
} = require("../controller/User");
const router = express.Router();

router
  .patch("/", updateUser)
  .get("/info", fetchUserById)
  .get("/", fetchAllUsersInfo)
  .patch("/admin", updateAdminUser)
  .delete("/admin/:id", adminDeleteUser);

exports.router = router;

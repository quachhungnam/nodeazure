const express = require("express");
// const multer = require('multer');

const router = express.Router();

const checkAuth = require("../middlewares/check-auth");
const AccountController = require("../controllers/accounts");

router.get("/", checkAuth, AccountController.accounts_get_all);

router.get("/:accountId", checkAuth, AccountController.accounts_get_account);

router.post("/signup", AccountController.account_signup);

router.post("/login", AccountController.account_login);

router.patch(
  "/:accountId",
  checkAuth,
  AccountController.accounts_update_account
);

router.patch(
  "/:accountId/status",
  checkAuth,
  AccountController.accounts_update_account_status
);

router.delete(
  "/:accountId",
  checkAuth,
  AccountController.accounts_delete_account
);

module.exports = router;

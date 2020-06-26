const express = require("express");
const multer = require("multer");

const router = express.Router();

const checkAuth = require("../middlewares/check-auth");
const AccountController = require("../controllers/accounts");
const upload = require("../middlewares/upload_image");

router.get("/", AccountController.accounts_get_all);

router.get("/:accountId", checkAuth, AccountController.accounts_get_account);

router.post("/signup", AccountController.account_signup);

router.post("/create", AccountController.account_create_account);

router.post("/login", AccountController.account_login);

router.post(
  "/:accountId/checkpassword",
  checkAuth,
  AccountController.accounts_check_account_password
);

router.patch(
  "/:accountId",
  checkAuth,
  AccountController.accounts_update_account
);

router.patch(
  "/:accountId/password",
  checkAuth,
  AccountController.accounts_update_account_password
);

router.patch(
  "/:accountId/status",
  checkAuth,
  AccountController.accounts_update_account_status
);

router.patch(
  "/:accountId/avatar",
  checkAuth,
  upload,
  AccountController.accounts_update_account_avatar
);

router.delete(
  "/:accountId",
  checkAuth,
  AccountController.accounts_delete_account
);
router.get(
  "/usertoken/yes",
  checkAuth,
  AccountController.get_account_from_token
);
module.exports = router;

const express = require("express");
// const multer = require('multer');

const router = express.Router();

const checkAuth = require("../middlewares/check-auth");
const DistrictsController = require("../controllers/districts");

router.get("/", DistrictsController.districts_get_all);

router.post("/", DistrictsController.districts_create_district);

router.get("/:provinceId", DistrictsController.districts_get_district);

router.patch("/:districtId", DistrictsController.districts_update_district);

router.delete("/:districtId", DistrictsController.districts_delete_district);

module.exports = router;

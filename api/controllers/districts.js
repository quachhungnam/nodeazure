const mongoose = require("mongoose");

const District = require("../models/district");
const Province = require("../models/province");

exports.districts_get_all = (req, res, next) => {
  District.find()
    .select("_id parent_code code name")
    .exec()
    .then((docs) => {
      res.status(200).json({
        success: true,
        data: {
          count: docs.length,
          districts: docs.map((doc) => {
            return {
              _id: doc._id,
              parent_code: doc.parent_code,
              code: doc.code,
              name: doc.name,
              request: {
                type: "GET",
                url: "http://localhost:3000/districts/" + doc._id,
              },
            };
          }),
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.districts_create_district = (req, res, next) => {
  Province.findById(req.body.province)
    .then((province) => {
      if (!province) {
        return res.status(404).json({
          success: false,
          message: "Province not found",
        });
      }
      const district = new District({
        _id: mongoose.Types.ObjectId(),
        province: req.body.province,
        name: req.body.name,
        type: req.body.type,
        slug: req.body.slug,
        name_with_type: req.body.name_with_type,
        path: req.body.path,
        path_with_type: req.body.path_with_type,
        code: req.body.code,
        parent_code: req.body.parent_code,
       
      });
      return district.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        success: true,
        message: "District stored",
        createdDistrict: {
          _id: result._id,
          province: result.province,
          name: result.name,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/districts/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.districts_get_district = (req, res, next) => {
  District.find({ parent_code: req.params.provinceId })
    .select("_id parent_code code name")
    .exec()
    .then((district) => {
      if (district.length == 0) {
        return res.status(404).json({
          success: false,
          message: "District not found",
        });
      }
      res.status(200).json({
        success: true,
        districts: district,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.districts_update_district = (req, res, next) => {
  const id = req.params.districtId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  District.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "District updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/districts/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.districts_delete_district = (req, res, next) => {
  District.remove({ _id: req.params.districtId })
    .exec()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "District deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/districts",
          body: { provinceId: "ID", name: "String" },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

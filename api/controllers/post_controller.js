const mongoose = require("mongoose");
const fs = require('fs');
const Post = require("../models/posts/post_model");
const Province = require("../models/province");
const Status = require("../models/posts/status_model");
const District = require("../models/district");
const Post_type = require("../models/posts/post_type_model");
const Account = require("../models/account");
const Rate = require("../models/posts/rate_model");
const Transaction = require("../models/posts/transaction_model");

module.exports.add_post = async (req, res, next) => {
    try {
        console.log(req.files)
        console.log(req.body)
        //get ID_account trong token va kiem tra
        const host_id = req.userData.accountId;
        const account = await Account.findById(host_id);
        if (!account) {
            return res.status(404).json({ error: "account not found" });
        }
        const post_type = await Post_type.findById(req.body.post_type_id);
        if (!post_type) {
            return res.status(404).json({ error: "post type not found" });
        }
        //mac dinh
        const status = await Status.find({ code: 0 });
        if (status.length <= 0) {
            return res.status(404).json({ error: "status not found" });
        }
        const province = await Province.find({ code: req.body.province_code });
        if (province.length <= 0) {
            return res.status(404).json({ error: "province not found" });
        }
        const district = await District.find({ code: req.body.district_code });
        if (district.length <= 0) {
            return res.status(404).json({ error: "district not found" });
        }
        // console.log(district)
        const new_post = new Post({
            _id: mongoose.Types.ObjectId(),
            title: req.body.title,
            host_id: host_id,
            post_type_id: req.body.post_type_id,
            province_id: req.body.province_id,
            district_id: req.body.district_id,
            status_id: status[0]._id, //tao bai post lan` dau thi mac dịnh status = 0
            price: req.body.price,
            square: req.body.square,
            address_detail: req.body.address_detail,
            description: req.body.description,
            created_at: new Date(),
            // updated_at: null,
        });
        new_post.save((err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.status(201).json({
                message: "post created",
                post: doc,
            });
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.add_post_new = async (req, res, next) => {
    try {
        //get ID_account trong token va kiem tra
        const host_id = req.userData.accountId;
        const account = await Account.findById(host_id);
        if (!account) {
            return res.status(404).json({ error: "account not found" });
        }

        let post_json = {}
        for (const [key, value] of Object.entries(req.body)) {
            post_json = await JSON.parse(value)
        }

        const post_type = await Post_type.findById(post_json.post_type_id);
        if (!post_type) {
            return res.status(404).json({ error: "post type not found" });
        }
        //mac dinh
        const status = await Status.find({ code: 0 });
        if (status.length <= 0) {
            return res.status(404).json({ error: "status not found" });
        }
        const province = await Province.find({ code: post_json.province_code });
        if (province.length <= 0) {
            return res.status(404).json({ error: "province not found" });
        }
        const district = await District.find({ code: post_json.district_code });
        if (district.length <= 0) {
            return res.status(404).json({ error: "district not found" });
        }
        const new_post = new Post({
            _id: mongoose.Types.ObjectId(),
            host_id: host_id,
            province_id: province[0]._id,
            district_id: district[0]._id,
            status_id: status[0]._id, //tao bai post lan` dau thi mac dịnh status = 0
            created_at: new Date(),
            // updated_at: null,
        });
        Object.assign(new_post, post_json)

        for (i = 0; i < req.files.length; i++) {
            let image = { _id: mongoose.Types.ObjectId(), path: req.files[i].path.replace('\\', '/') }
            new_post.post_image.push(image)
        }
        console.log('111')
        new_post.save((err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ error: err });
            }
            res.status(201).json({
                message: "post created",
                post: doc,
            });
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.update_post = async (req, res, next) => {
    try {
        //kiem tra user co dang login hay ko
        //gui le body
        //kiem tra thu co file ko, so sanh voi mang id
        // console.log(req.body)
        // console.log(req.files)
        const host_id = req.userData.accountId;
        const account = await Account.findById(host_id);
        if (!account) {
            return res.status(404).json({ error: "account not found" });
        }

        let post_json = {}
        for (const [key, value] of Object.entries(req.body)) {
            post_json = await JSON.parse(value)
        }
        // console.log("post truoc--" + JSON.stringify(post_json))
        const post_id = req.params.postId;
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ error: "post not found" });
        }
        //xoa object anh trong post
        //xoa nhung anh update
        let new_post_image = post.post_image
        if (post_json.delete_image) {
            for (let i = 0; i < post_json.delete_image.length; i++) {
                //xoa anh bi xoa khoi server
                fs.unlink(post_json.delete_image[i].path, function () { })
                for (let j = 0; j < new_post_image.length; j++) {
                    post_json.delete_image[i]._id == new_post_image[j]._id
                    new_post_image.splice(j, 1);
                }
            }
            delete post_json.delete_image
        }
        post_json.post_image = new_post_image
        //tao 1 post_image moi
        // xoa toan bo file trong nay, xong roi push len mang moi ???
        const updateOps = {};
        for (const [key, value] of Object.entries(post_json)) {
            // console.log(key, value)
            updateOps[key] = value;
        }

        if (updateOps.post_type_id) {
            const post_type = await Post_type.findById(post_json.post_type_id);
            if (!post_type) {
                return res.status(404).json({ error: "post type not found" });
            }
        }
        //gui status_code len chu' ko gui status_id
        if (updateOps.status_code) {
            const status = await Status.find({ code: updateOps.status_code });
            if (status.length <= 0) {
                return res.status(404).json({ error: "status not found" });
            }
            if (updateOps.status_code != 2) {
                Transaction.deleteOne({ post_id: post_id })
                    .exec()
                    .then(() => { })
                    .catch((err) => {
                        return res.status(500).json({ error: err });
                    });
            }
            updateOps.status_id = status[0]._id;
            delete updateOps.status_code; //xoa truong status_code trong updateOps
        }

        //kiem tra ma Tinh co ton tai ko
        if (updateOps.province_code) {
            const province = await Province.find({ code: post_json.province_code });
            if (province.length <= 0) {
                return res.status(404).json({ error: "province not found" });
            }
        }
        //kiem tra ma Huyen co ton tai ko
        if (updateOps.district_code) {
            const district = await District.find({ code: post_json.district_code });
            if (district.length <= 0) {
                return res.status(404).json({ error: "district not found" });
            }
        }

        //them cac file moi vao DB
        if (req.files) {
            for (i = 0; i < req.files.length; i++) {
                let image = { _id: mongoose.Types.ObjectId(), path: req.files[i].path.replace('\\', '/') }
                updateOps.post_image.push(image)
            }
        }
        // console.log("post sau--" + JSON.stringify(updateOps))

        updateOps.updated_at = new Date();
        Post.updateMany({ _id: post_id }, { $set: updateOps })
            .exec()
            .then((result) => {
                res.status(200).json({
                    message: "updated post",
                });
            })
            .catch((err) => {
                // console.log(err);
                res.status(500).json({ error: err });
            });
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: err });
    }
};

module.exports.update_post_status = async (req, res, next) => {
    try {
        const host_id = await req.userData.accountId;
        const account = await Account.findById(host_id);
        if (!account) {
            return res.status(404).json({ error: "account not found" });
        }

        const post_id = await req.params.postId;
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ error: "post not found" });
        }

        const updateOps = {};
        for (const [key, value] of Object.entries(req.body)) {
            updateOps[key] = value;
        }
        // console.log('hhh')s
        if (updateOps.status_code) {
            const status = await Status.find({ code: updateOps.status_code });
            if (status.length <= 0) {
                return res.status(404).json({ error: "status not found" });
            }
            //get status co code = 2
            const status_id_old = await Status.find({ code: 2 });

            ///xoa transaction khi doi status_code khac 2
            // console.log("stautus_id= " + status_id_old[0]._id)
            if (updateOps.status_code != 2) {
                Transaction.deleteOne({ post_id: post_id })
                    .exec()
                    .then(() => { })
                    .catch((err) => {
                        return res.status(500).json({ error: err });
                    });
            }
            updateOps.status_id = status[0]._id;
            delete updateOps.status_code; //xoa truong status_code trong updateOps
        }


        updateOps.updated_at = new Date();
        Post.updateMany({ _id: post_id }, { $set: updateOps })
            .exec()
            .then(() => {
                res.status(200).json({
                    message: "updated status of post",
                });
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.delete_post = async (req, res, next) => {
    try {

        const id = req.params.postId;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "post not found" });
        }
        if (post) {
            for (i = 0; i < post.post_image.length; i++) {
                //xoa toan bo anh trong server
                fs.unlink(post.post_image[i].path, function () { })
            }
        }
        //xoa post cung dong thoi xoa transaction, xoa rate cua post do
        //xoa cac danh gia cua nguoi dung
        Rate.deleteMany({ post_id: id })
            .exec()
            .then((result) => { })
            .catch((err) => {
                return res.status(500).json({ error: err });
            });
        //xoa luon hop dong` dang ky lien quan toi post
        Transaction.deleteOne({ post_id: id })
            .exec()
            .then(() => { })
            .catch((err) => {
                return res.status(500).json({ error: err });
            });

        Post.deleteOne({ _id: id })
            .exec()
            .then(() => {
                res.status(200).json({
                    message: "post deleted",
                });
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.get_a_post = async (req, res, next) => {
    try {
        const post_id = await req.params.postId;
        const post = await Post.findById(post_id)
            .populate({ path: "host_id", select: "name username email mobile" })
            .populate({ path: "post_type_id", select: "name description" })
            .populate({ path: "province_id", select: "name code name_with_type" })
            .populate({
                path: "district_id",
                select: "name code parent_code name_with_type",
            })
            .populate({ path: "status_id", select: "code description" });
        if (!post) {
            return res.status(404).json({
                error: "post not found",
            });
        }
        res.status(200).json({
            post: post,
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};

module.exports.get_all_post = async (req, res, next) => {
    try {
        const post = await Post.find()
            .sort({ created_at: "desc" })
            .populate({ path: "host_id", select: "name username email mobile" })
            .populate({ path: "post_type_id", select: "name description" })
            .populate({ path: "province_id", select: "name code name_with_type" })
            .populate({
                path: "district_id",
                select: "name code parent_code name_with_type",
            })
            .populate({ path: "status_id", select: "code description" });
        // if (post.length <= 0) {
        //     return res.status(404).json({
        //         error: 'post not found'
        //     })
        // }
        res.status(200).json({
            count: post.length,
            post: post,
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};

module.exports.get_all_post_with_page = async (req, res, next) => {
    try {
        const status_code = await req.params.code;
        const status = await Status.find({ code: status_code });
        const post = await Post.find({ status_id: status[0]._id })
            .sort({ created_at: "desc" }) //thoi gian tao gan nhat thi o dau
            .populate({ path: "host_id", select: "name username email mobile" })
            .populate({ path: "post_type_id", select: "name description" })
            .populate({ path: "province_id", select: "name code name_with_type" })
            .populate({
                path: "district_id",
                select: "name code parent_code name_with_type",
            })
            .populate({ path: "status_id", select: "code description" })
        // if (posts.length <= 0) {
        //     return res.status(404).json({
        //         error: 'post not found'
        //     })
        // }
        result = {
            count: post.length,
            post: post,
        };
        // if (req.params.pageNumber) {
        const at_page = await parseInt(req.params.pageNumber) || 1
        result = paging(post, at_page, 10)
        if (result.error) {
            return res.status(500).json({
                error: result.error,
            })
        }
        // }
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};

module.exports.get_all_post_with_status = async (req, res, next) => {
    try {
        const status_code = await req.params.code;
        const status = await Status.find({ code: status_code });
        const post = await Post.find({ status_id: status[0]._id })
            .sort({ created_at: "desc" })
            .populate({ path: "host_id", select: "name username email mobile" })
            .populate({ path: "post_type_id", select: "name description" })
            .populate({ path: "province_id", select: "name code name_with_type" })
            .populate({
                path: "district_id",
                select: "name code parent_code name_with_type",
            })
            .populate({ path: "status_id", select: "code description" })
        // if (post.length <= 0) {
        //     return res.status(404).json({
        //         error: 'post not found'
        //     })
        // }
        res.status(200).json({
            count: post.length,
            post: post,
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};

module.exports.get_all_post_with_options = async (req, res, next) => {
    try {
        option = {};
        if (req.params.typeId) {
            const post_type = await Post_type.findById(req.params.typeId);
            option.post_type_id = post_type._id;
        }
        if (req.params.hostId) {
            const host_id = await Account.findById(req.params.hostId);
            option.host_id = host_id._id;
        }

        const post = await Post.find(option)
            .sort({ created_at: "desc" })
            .populate({ path: "host_id", select: "name mobile" })
            .populate({ path: "post_type_id", select: "name" })
            .populate({ path: "province_id", select: "name name_with_type" })
            .populate({ path: "district_id", select: "name name_with_type" })
            .populate({ path: "status_id", select: "code description" });
        // if (post.length <= 0) {
        //     return res.status(404).json({
        //         error: "post not found",
        //     });
        // }
        res.status(200).json({
            count: post.length,
            post: post,
        });
    } catch (err) {
        // console.log(err)
        res.status(500).json({
            error: err,
        });
    }
};


module.exports.get_all_post_of_account = async (req, res, next) => {
    try {
        option = {};
        const host_id = req.userData.accountId;
        const account = await Account.findById(host_id);
        if (!account) {
            return res.status(404).json({ error: "account not found" });
        }

        option.host_id = account._id;

        const post = await Post.find(option)
            .sort({ created_at: "desc" })
            .populate({ path: "host_id", select: "name mobile" })
            .populate({ path: "post_type_id", select: "name" })
            .populate({ path: "province_id" })
            .populate({ path: "district_id" })
            .populate({ path: "status_id", select: "code description" });
        // if (post.length <= 0) {
        //     return res.status(404).json({
        //         error: "post not found",
        //     });
        // }
        res.status(200).json({
            count: post.length,
            post: post,
        });
    } catch (err) {
        // console.log(err)
        res.status(500).json({
            error: err,
        });
    }
};


module.exports.get_all_post_with_address = async (req, res, next) => {
    try {
        option = {};
        if (req.body.address) {
            option.address_detail = { $regex: `.*${req.body.address}.*`, $options: "i" }
        }
        const post = await Post.find(option)
            .populate({ path: "host_id", select: "name mobile" })
            .populate({ path: "post_type_id", select: "name" })
            .populate({ path: "province_id", select: "name name_with_type" })
            .populate({ path: "district_id", select: "name name_with_type" })
            .populate({ path: "status_id", select: "code description" });
        if (post.length <= 0) {
            return res.status(404).json({
                error: "post not found",
            });
        }
        res.status(200).json({
            count: post.length,
            post: post,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
};

function paging(posts, at_page, number_per_page) {
    if (isNaN(at_page)) {
        return { error: "page is not a number " };
    }
    const total_page = parseInt(posts.length / number_per_page) + 1;
    if (at_page > total_page) {
        return { error: "current page is bigger total page " };
    }
    const start_index_post = (at_page - 1) * number_per_page;
    const end_index_post = at_page * number_per_page;
    const post_in_a_page = posts.slice(start_index_post, end_index_post);

    result = {
        count_total: posts.length,
        count_a_page: post_in_a_page.length,
        total_page: total_page,
        post: post_in_a_page,
    };
    return result;
}

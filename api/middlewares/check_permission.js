const mongoose = require('mongoose')
const User_Permission = require('../models/auth/auth_user_permissions_model')
const User = require('../models/users/user_model')
const Permision = require('../models/auth/auth_permmission_model')


//mot super user thi` co' toan` quyen`
// staff thi duoc log vao trang admin
// neu chua login thi chuyen den trang login
//neu la super user thi next
//neu la staff thi duoc phep login admin site, sau do check permission querry toi
//
function check_cc(model_name, action_name) {

}
module.exports.check_view = async (req, res, next) => {
    const rs = check_permission('posts', 'view')
    const user = req.body.user
    //neu la nhan vien
    if (user.is_superuser) {
        next()
    }
    if (user.is_staff) {
        //select * from user_permisstion innerjoin permisstion where user=user and per=per
        //tim duoc 1 dong permisstion cua cai user nay
        const check = await User_Permission.find({ user: user })
            .populate({
                path: 'Permission',
                match: { codename: 'view_posts' }
            })
        if (check.length <= 0) {
            next()
        } else {
            return res.status(500).json({ error: 'error' })
        }

    }
}
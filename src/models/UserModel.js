import sequelize from '../lib/sequelize';
const { webDBUtil } = sequelize;
const User = webDBUtil.import(`../schema/user`);
User.sync({
    force: false
});

class UserModel {
    /**
     * 创建用户
     * @param user
     * @returns {Promise<boolean>}
     */
    static async create(user) {
        let {
            sno, password, classes, image, type
        } = user;
        let name = user.username;
        await User.create({
            name,
            sno,
            password,
            classes,
            image,
            type
        });
        return true;
    }
    //
    // /**
    //  * 删除用户
    //  * @param id listID
    //  * @returns {Promise.<boolean>}
    //  */
    // static async delete(id) {
    //     await User.destroy({
    //         where: {
    //             id
    //         }
    //     })
    //     return true;
    // }
    //
    // /**
    //  * 查询用户列表
    //  * @returns {Promise<*>}
    //  */
    // static async findAllUserList() {
    //     return User.findAll({
    //         attributes: ['id', 'username', 'email']
    //     });
    // }

    /**
     * 查询用户信息
     * @param sno  学号/教职工编号
     * @returns {Promise.<*>}
     */
    static async usersno(sno) {
        return User.findOne({
            where: {
                sno
            }
        });
    }

    /**
     * 修改信息
     * @param user
     * @returns {Promise<boolean>}
     */
    static async update(id, data) {
        await User.update(data, {
            where: {
                id
            },
            fields: ['password', 'classes', 'image']
        });
        return true;
    }
}

module.exports = UserModel;

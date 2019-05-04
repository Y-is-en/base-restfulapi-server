import sequelize from '../lib/sequelize';
const { webDBUtil } = sequelize;
const UserSub = webDBUtil.import(`../schema/usersub`);
UserSub.sync({
    force: false
});

class UserSubModel {
    /**
     * 创建学生课程关系记录
     * @param subject
     * @returns {Promise<boolean>}
     */
    static async create(sno, password) {
        await UserSub.create({
            sno, password
        });
        return true;
    }

    /**
     * 删除学生课程关系记录
     * @param id
     * @returns {Promise.<boolean>}
     */
    static async delete(sno, password) {
        await UserSub.destroy({
            where: {
                sno, password
            }
        });
        return true;
    }

    /**
     * 查询课程的所有学生
     * @param password
     * @returns {Promise<*>}
     */
    static async findByPassword(password) {
        return UserSub.findAll({
            where: {
                password
            }
        });
    }

    /**
     * 查询学生的所有课程
     * @param password
     * @returns {Promise<*>}
     */
    static async findBySno(sno) {
        return UserSub.findAll({
            where: {
                sno
            }
        });
    }

    /**
     * 查询学生的某个课程
     * @param password
     * @returns {Promise<*>}
     */
    static async findBySnoPassword(sno, password) {
        return UserSub.findAll({
            where: {
                sno,
                password
            }
        });
    }
}

module.exports = UserSubModel;

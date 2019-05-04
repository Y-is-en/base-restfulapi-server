import sequelize from '../lib/sequelize';
const { webDBUtil } = sequelize;
const Subject = webDBUtil.import(`../schema/subject`);
Subject.sync({
    force: false
});
const Op = sequelize.Op;
class SubjectModel {
    /**
     * 创建课程
     * @param subject
     * @returns {Promise<boolean>}
     */
    static async create(subject) {
        let {
            name, date, begin, end, location, openjoin, status, teacher, teacherno, password, remark
        } = subject;
        await Subject.create({
            name, date, begin, end, location, openjoin, status, teacher, teacherno, password, remark
        });
        return true;
    }

    /**
     * 创建多个课程
     * @param subjects
     * @returns {Promise<boolean>}
     */
    static async createMany(subjects) {
        await Subject.bulkCreate(subjects);
        return true;
    }

    /**
     * 删除某节课程
     * @param id
     * @returns {Promise.<boolean>}
     */
    static async delete(id) {
        await Subject.destroy({
            where: {
                id
            }
        });
        return true;
    }

    /**
     * 删除某个课程
     * @param name teacherno
     * @returns {Promise.<boolean>}
     */
    static async deleteAll(name, teacherno) {
        await Subject.destroy({
            where: {
                name, teacherno
            }
        });
        return true;
    }

    /**
     * 更新某节课程信息
     * @param id data
     * @returns {Promise.<boolean>}
     */
    static async update(id, data) {
        await Subject.update(data, {
            where: {
                id
            }
        });
        return true;
    }

    // /**
    //  * 更新节课程信息
    //  * @param id listID
    //  * @returns {Promise.<boolean>}
    //  */
    // static async updateByName(name, data) {
    //     await Subject.upadteOne(data, {
    //         where: {
    //             name
    //         },
    //         fields: ['date', 'begin', 'end']
    //     });
    //     return true;
    // }

    /**
     * 根据日期查询课程
     * @param date teacherno
     * @returns {Promise<*>}
     */
    static async findByDate(date, teacherno) {
        return Subject.findAll({
            where: {
                date, teacherno
            }
        });
    }

    /**
     * 查询某个老师的某一课程
     * @param name  teacherno
     * @returns {Promise.<*>}
     */
    static async subname(name, teacherno) {
        return Subject.find({
            where: {
                name,
                teacherno
            }
        });
    }

    /**
     * 根据邀请码查询课程
     * @param password
     * @returns {Promise.<*>}
     */
    static async selectByPassword(password) {
        return Subject.findOne({
            where: {
                password
            }
        });
    }

    /**
     * 根据多个邀请码查询课程
     * @param password
     * @returns {Promise.<*>}
     */
    static async selectByPasswords(passwords, page) {
        return Subject.findAndCount({
            limit: 10, //每页10条
            offset: (page - 1) * 10,
            where: {
                password: {
                    $in: passwords
                }
            }
        });
    }

    /**
     * 根据多个邀请码和日期查询课程
     * @param password
     * @returns {Promise.<*>}
     */
    static async selectByPasswordsDate(passwords, date) {
        return Subject.findAll({
            where: {
                password: {
                    $in: passwords
                },
                date
            }
        });
    }

    /**
     * 更新课程加入权限
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async updateOpenJoin(name, teacherno, data) {
        await Subject.update(data, {
            where: {
                name, teacherno
            }
        });
        return true;
    }
    /**
     * 更新课程签到状态
     * @param name
     * @param data
     * @returns {Promise.<boolean>}
     */
    static async updateStatus(id, teacherno, data) {
        await Subject.update(data, {
            where: {
                id, teacherno
            }
        });
        return true;
    }
    /**
     * 通过课程名查找课程
     * @param params
     * @returns {Promise.<boolean>}
     */
    static async search(params) {
        return Subject.findAll({
            where: {
                name: {
                    // 模糊查询
                    [Op.like]: '%' + params + '%'
                }
            },
            'order': [
                ['password', 'DESC']
            ]
        });
    }
    /**
     * 通过id查找课程
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async searchById(id) {
        return Subject.findOne({
            where: {
                id
            }
        });
    }
}

module.exports = SubjectModel;

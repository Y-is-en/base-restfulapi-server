import sequelize from '../lib/sequelize';
const { webDBUtil } = sequelize;
const Result = webDBUtil.import(`../schema/result`);
Result.sync({
    force: false
});

class ResultModel {
    /**
     * 创建记录
     * @param result
     * @returns {Promise<boolean>}
     */
    static async create(result) {
        let {
            sno, subid, password, teacherno, status, date, name
        } = result;
        await Result.create({
            sno, subid, password, teacherno, status, date, name
        });
        return true;
    }

    /**
     * 查询某课程的某个学生签到记录
     * @param password
     * @returns {Promise<*>}
     */
    static async findByPasswordSno(subid, sno) {
        return Result.findOne({
            where: {
                subid, sno, status: 1
            }
        });
    }

    /**
     * 查询某节的所有学生的签到记录
     * @param password
     * @returns {Promise<*>}
     */
    static async findByPasswordTno(id, teacherno, page) {
        return Result.findAndCountAll({
            limit: 20, //每页20条
            offset: (page - 1) * 20,
            where: {
                subid: {
                    $in: id
                },
                teacherno,
                status: 1
            }
        });
    }

    /**
     * 查询某学生某段时间的签到记录
     * @param password
     * @returns {Promise<*>}
     */
    static async findBySnoDate(sno, begin, end) {
        return Result.findAndCountAll({
            where: {
                sno,
                date: {
                    $between: [begin, end]
                }
            }
        });
    }

    /**
     * 查询某课程的所有学生的签到记录
     * @param password
     * @returns {Promise<*>}
     */
    static async findByPassword(password, teacherno) {
        return Result.findAndCountAll({
            where: {
                password,
                teacherno
            }
        });
    }
}

module.exports = ResultModel;

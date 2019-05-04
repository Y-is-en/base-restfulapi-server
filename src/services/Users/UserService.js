import result from '../../tools/Result';
import { ValidateTools } from '../../middleware/ValidateTools';
import UserModel from '../../models/UserModel';
import bcrypt from 'bcryptjs';
import Utils from '../../tools/Utils';
const validateTools = new ValidateTools();

// import sequelize from '../lib/sequelize';
// const {
//     database1Util
// } = sequelize;
// const userModel = database1Util.import(`../models/userModel`);

/**
 * test TestService
 * 本页面处理业务逻辑 接收参数与返回处理结果
 */
module.exports = class UserService {

    /**
     * 用户注册
     * @param {*} user
     */
    async userRegister(user) {
        let { username, sno, password, classes, image, type = 0 } = user;
        let params = {
            username,
            sno,
            password,
            classes,
            image
        };
        // 检测参数是否存在为空
        for (let item in params) {
            if (params[item] === undefined) {
                return result.paramsLack('错误: 参数: ' + item + '不能为空', 412, '');
            }
        }

        params.type = type;
        // 查询用户名是否重复
        const existUser = await UserModel.usersno(params.sno);
        if (existUser) {
            return result.failed('用户已经存在', 403);
        }
        try {
            // 加密密码
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(params.password, salt);
            params.password = hash;

            // 创建用户
            await UserModel.create(params);
            const newUser = await UserModel.usersno(params.sno);

            // 签发token
            const userToken = {
                username: newUser.username,
                email: newUser.email,
                id: newUser.id
            };

            // 储存token失效有效期1小时
            const token = validateTools.getJWT(userToken, '1h');

            return result.success('注册成功', token);

        } catch (err) {
            return result.failed(err, 500);
        }
    }

    /**
     * 用户登录
     * @param {*} user
     */
    async userLogin({ sno, password }) {
        let params = {
            sno,
            password
        };
        // 检测参数是否存在为空
        for (let item in params) {
            if (params[item] === undefined) {
                return result.paramsLack('错误: 参数: ' + item + '不能为空', 412, '');
            }
        }
        // 查询用户
        const userDetail = await UserModel.usersno(sno);
        if (!userDetail) {
            return result.failed('用户不存在', 403);
        }
        //校验密码
        if (bcrypt.compareSync(password, userDetail.password)) {
            //密码正确，生成用户Token
            let userToken = {
                id: userDetail.id,
                username: userDetail.name,
                sno: userDetail.sno,
                classes: userDetail.classes,
                image: userDetail.image,
                type: userDetail.type
            };
            userToken.token = validateTools.getJWT(userToken, 60 * 60 * 24 * 3);
            return result.success('登录成功', userToken);
        } else {
            return result.failed('密码错误', 401);
        }

    }
    /**
     * 修改密码
     * @param {*} jwt
     * @param password
     */
    async getInfo(jwt) {
        if (!jwt) {
            return result.authorities('未登录', 403, '');
        }
        const data = Utils.getJwtData(jwt);
        return result.success('查询成功', data)
    }
    /**
     * 修改密码
     * @param {*} jwt
     * @param password
     */
    async updatePassword(jwt, password) {
        if (!jwt) {
            return result.authorities('Token 不能为空', 403, '');
        }
        if (password === undefined) {
            return result.paramsLack('错误: 密码不能为空', 412, '');
        };
        try {
            const validate = validateTools.validateJWT(jwt);
            if (validate) {
                const salt = bcrypt.genSaltSync();
                password = bcrypt.hashSync(password, salt);
                await UserModel.update(validate.data.id, { password });
                let userToken = validate.data;
                userToken.token = validateTools.getJWT(userToken, 60 * 60 * 24 * 3);
                return result.success('密码已修改', userToken);
            } else {
                return result.authorities();
            }
        } catch (error) {
            console.log(error);
            return result.failed();
        }
    }
    // /**
    //  * 获取用户列表
    //  * @param {*} ctx
    //  */
    // async getUserList(jwt) {
    //     try {
    //         const validate = validateTools.validateJWT(jwt);
    //         if (validate) {
    //             console.log(validate);
    //             return result.success('解析token', validate);
    //         } else {
    //             return result.authorities();
    //         }
    //         /*
    //            const res = await userModel.findAll({
    //                where: {},
    //                attributes: ['id', 'username', 'password']
    //            });
    //            return result.pageData(null, null, res, res.length, 10, 1); */
    //     } catch (error) {
    //         console.log(error);
    //         return result.failed();
    //     }
    // }

    // /**
    //  * 事务demo
    //  * @param {*} data
    //  */
    // async demoTest(data) {
    //     // 创建事务
    //     tx_dbUtil.transaction((t) => {
    //         // 在事务中执行操作
    //         return AgentInfoModel.create({
    //             IpAddress: IP,
    //             Explain: Explain,
    //             AgentUsename: AgentInfo.AgentUsename,
    //             AgentNumber: AgentNumber,
    //             CreatedName: AgentUsename
    //         }, { transaction: t }).then((user) => {
    //             return AgentIpListModel.findAndCount(user, { transaction: t })
    //         });
    //     }).then((results) => {
    //         console.log(`操作成功，事务会自动提交`, results);
    //         /* 操作成功，事务会自动提交 */
    //     }).catch((err) => {
    //         console.log(`操作失败，事件会自动回滚`, err);
    //         /* 操作失败，事件会自动回滚 */
    //     });
    // }

    // /**
    //  * 事务demo
    //  * @param {*} data
    //  */
    // async demoTest1(data) {
    //     try {
    //         // 创建事务
    //         /* 操作成功，事务会自动提交 */
    //         /* 操作失败，事件会自动回滚 */
    //         const results = await tx_dbUtil.transaction(async(t) => {
    //             // 在事务中执行操作
    //             const a = await a.create( /* {} */ , { transaction: t });
    //             const b = await b.create( /* {} */ , { transaction: t });
    //             const c = await c.create( /* {} */ , { transaction: t });
    //             return c;
    //         });
    //         return result.success();
    //     } catch (error) {
    //         return result.failed();
    //     }
    // }
};

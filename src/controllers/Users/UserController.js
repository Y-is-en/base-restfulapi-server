import KoaRouter from 'koa-router';
import services from '../../services';
const router = new KoaRouter();
const userService = new services.Users.UserService();

/**
 * UserController
 * 用户信息类
 */
class UserController {

    /**
     * 用户注册
     * @param {*} ctx
     */
    async register(ctx) {
        ctx.body = await userService.userRegister(ctx.request.body);
    }

    /**
     * 用户登录
     * @param {*} ctx
     */
    async userLogin(ctx) {
        ctx.body = await userService.userLogin(ctx.request.body);
    }

    /**
     * 获取用户信息
     * @param {*} ctx
     */
    async getInfo(ctx) {
        ctx.body = await userService.getInfo(ctx.request.header.authorization);
    }

    /**
     * 修改密码
     * @param {*} ctx
     */
    async updatePassword(ctx) {
        ctx.body = await userService.updatePassword(ctx.request.header.authorization, ctx.query.password);
    }
}

const {
    register,
    userLogin,
    getInfo,
    updatePassword
} = new UserController();

/* eslint-disable */
const routers = [{
        url: `/userLogin`,
        method: 'post',
        acc: userLogin
    },
    {
        url: `/updatePassword`,
        method: 'get',
        acc: updatePassword
    },
    {
        url: `/getInfo`,
        method: 'get',
        acc: getInfo
    },
    {
        url: `/register`,
        method: 'post',
        acc: register
    },
];

/* eslint-enable */

//挂载路由
routers.forEach(item => {
    router[item.method](item.url, item.acc);
});

module.exports = router;

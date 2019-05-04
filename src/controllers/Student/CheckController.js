import KoaRouter from 'koa-router';
import services from '../../services';
const router = new KoaRouter();
const SubjectService = new services.Student.SubjectService();

/**
 * UserController
 * 用户信息类
 */
class CheckController {

    /**
     * 学生签到统计
     * @param {*} ctx
     */
    async signIn(ctx) {
        ctx.body = await SubjectService.Signin(ctx.request.header.authorization, ctx.query);
    }
}

const {
    signIn
} = new CheckController();

/* eslint-disable */
const routers = [
    {
        url: `/signIn`,
        method: 'get',
        acc: signIn
    },
];

/* eslint-enable */

//挂载路由
routers.forEach(item => {
    router[item.method](item.url, item.acc);
});

module.exports = router;

import KoaRouter from 'koa-router';
import services from '../../services';
const router = new KoaRouter();
const subjectService = new services.Teacher.SubjectService();

/**
 * UserController
 * 用户信息类
 */
class CheckController {

    /**
     * 启动签到
     * @param {*} ctx
     */
    async beginCheck(ctx) {
        ctx.body = await subjectService.updateCheckStatus(ctx.request.header.authorization, ctx.query, 1);
    }

    /**
     * 暂停签到
     * @param {*} ctx
     */
    async stopCheck(ctx) {
        ctx.body = await subjectService.updateCheckStatus(ctx.request.header.authorization, ctx.query, 10);
    }

    /**
     * 结束签到
     * @param {*} ctx
     */
    async endCheck(ctx) {
        ctx.body = await subjectService.updateCheckStatus(ctx.request.header.authorization, ctx.query, 11);
    }
}

const {
    beginCheck,
    stopCheck,
    endCheck
} = new CheckController();

/* eslint-disable */
const routers = [{
        url: `/beginCheck`,
        method: 'get',
        acc: beginCheck
    },
    {
        url: `/stopCheck`,
        method: 'get',
        acc: stopCheck
    },
    {
        url: `/endCheck`,
        method: 'get',
        acc: endCheck
    },
];

/* eslint-enable */

//挂载路由
routers.forEach(item => {
    router[item.method](item.url, item.acc);
});

module.exports = router;

import KoaRouter from 'koa-router';
import services from '../../services';
const router = new KoaRouter();
const subjectService = new services.Student.SubjectService();

/**
 * UserController
 * 用户信息类
 */
class ResultController {

    /**
     * 学生签到统计
     * @param {*} ctx
     */
    async signInCount(ctx) {
        ctx.body = await subjectService.getSubjectByDates(ctx.request.header.authorization, ctx.query);
    }
}

const {
    signInCount
} = new ResultController();

/* eslint-disable */
const routers = [{
        url: `/signInCount`,
        method: 'get',
        acc: signInCount
    },
];

/* eslint-enable */

//挂载路由
routers.forEach(item => {
    router[item.method](item.url, item.acc);
});

module.exports = router;

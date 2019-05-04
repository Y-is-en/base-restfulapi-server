import KoaRouter from 'koa-router';
import services from '../../services';
const router = new KoaRouter();
const subjectService = new services.Teacher.SubjectService();

/**
 * UserController
 * 用户信息类
 */
class ResultController {

    /**
     * 获取某一课程学生的签到情况
     * @param {*} ctx
     */
    async getSubjectSinin(ctx) {
        ctx.body = await subjectService.getSinIn(ctx.request.header.authorization, ctx.query);
    }
}

const {
    getSubjectSinin
} = new ResultController();

/* eslint-disable */
const routers = [{
        url: `/getSubjectSinin`,
        method: 'get',
        acc: getSubjectSinin
    },
];

/* eslint-enable */

//挂载路由
routers.forEach(item => {
    router[item.method](item.url, item.acc);
});

module.exports = router;

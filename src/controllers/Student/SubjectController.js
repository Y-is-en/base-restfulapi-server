import KoaRouter from 'koa-router';
import services from '../../services';
const router = new KoaRouter();
const subjectService = new services.Student.SubjectService();

/**
 * UserController
 * 用户信息类
 */
class SubjectController {

    /**
     * 学生加入课堂
     * @param {*} ctx
     */
    async joinSubject(ctx) {
        ctx.body = await subjectService.joinSubject(ctx.request.header.authorization, ctx.query);
    }

    /**
     * 查找课程
     * @param {*} ctx
     */
    async search(ctx) {
        ctx.body = await subjectService.searchSubject(ctx.request.header.authorization, ctx.query);
    }

    /**
     * 查询某一天的课程
     * @param {*} ctx
     */
    async getSubjectByDay(ctx) {
        ctx.body = await subjectService.getSubjectBydate(ctx.request.header.authorization, ctx.query);
    }

    /**
     * 查询全部课程
     * @param {*} ctx
     */
    async getSubjects(ctx) {
        ctx.body = await subjectService.getSubjects(ctx.request.header.authorization, ctx.query);
    }
}

const {
    joinSubject,
    search,
    getSubjectByDay,
    getSubjects
} = new SubjectController();

/* eslint-disable */
const routers = [{
        url: `/joinSubject`,
        method: 'get',
        acc: joinSubject
    },
    {
        url: `/search`,
        method: 'get',
        acc: search
    },
    {
        url: `/getSubjectByDay`,
        method: 'get',
        acc: getSubjectByDay
    },
    {
        url: `/getSubjects`,
        method: 'get',
        acc: getSubjects
    },
];

/* eslint-enable */

//挂载路由
routers.forEach(item => {
    router[item.method](item.url, item.acc);
});

module.exports = router;

import KoaRouter from 'koa-router';
import services from '../../services';
const router = new KoaRouter();
const subjectService = new services.Teacher.SubjectService();

/**
 * SubjectController
 * 课程信息类
 */
class SubjectController {

    /**
     * 添加课堂
     * @param {*} ctx
     */
    async addSubject(ctx) {
        ctx.body = await subjectService.addSubject(ctx.request.header.authorization, ctx.request.body);
    }

    /**
     * 更改某节课堂时间或地点
     * @param {*} ctx
     */
    async updateOnce(ctx) {
        ctx.body = await subjectService.updateOrDeleteSubject(ctx.request.header.authorization, ctx.request.body, false);
    }

    /**
     * 更改某课程名称/时间/地点/备注
     * @param {*} ctx
     */
    async updateSubject(ctx) {
        ctx.body = await subjectService.updateSubject(ctx.request.header.authorization, ctx.request.body);
    }

    /**
     * 删除某节课堂
     * @param {*} ctx
     */
    async deleteOnce(ctx) {
        ctx.body = await subjectService.updateOrDeleteSubject(ctx.request.header.authorization, ctx.query, true);
    }

    /**
     * 删除某课程
     * @param {*} ctx
     */
    async deleteSubject(ctx) {
        ctx.body = await subjectService.deleteAllSubject(ctx.request.header.authorization, ctx.query);
    }

    /**
     * 查询某一天的课程
     * @param {*} ctx
     */
    async getSubjectByday(ctx) {
        ctx.body = await subjectService.getSubjectBydate(ctx.request.header.authorization, ctx.query);
    }

    /**
     * 更新课程的加入权限
     * @param {*} ctx
     */
    async setOpenJoin(ctx) {
        ctx.body = await subjectService.setOpenJoin(ctx.request.header.authorization, ctx.query);
    }

    /**
     * 查询某一课程的学生
     * @param {*} ctx
     */
    async getStudents(ctx) {
        ctx.body = await subjectService.getUserList(ctx.request.header.authorization, ctx.query);
    }

    /**
     * 查询某一课程信息
     * @param {*} ctx
     */
    async getSubject(ctx) {
        ctx.body = await subjectService.getSubject(ctx.request.header.authorization, ctx.query);
    }

    /**
     * 移除某一课程某一个学生
     * @param {*} ctx
     */
    async removeStudent(ctx) {
        ctx.body = await subjectService.removeStudent(ctx.request.header.authorization, ctx.query);
    }

}

const {
    addSubject,
    updateOnce,
    updateSubject,
    deleteOnce,
    deleteSubject,
    setOpenJoin,
    getSubjectByday,
    getStudents,
    getSubject,
    removeStudent
} = new SubjectController();

/* eslint-disable */
const routers = [{
        url: `/addSubject`,
        method: 'post',
        acc: addSubject
    },
    {
        url: `/updateOnce`,
        method: 'post',
        acc: updateOnce
    },
    {
        url: `/updateSubject`,
        method: 'post',
        acc: updateSubject
    },
    {
        url: `/deleteOnce`,
        method: 'get',
        acc: deleteOnce
    },
    {
        url: `/deleteSubject`,
        method: 'get',
        acc: deleteSubject
    },
    {
        url: `/setOpenJoin`,
        method: 'get',
        acc: setOpenJoin
    },
    {
        url: `/getSubjectByday`,
        method: 'get',
        acc: getSubjectByday
    },
    {
        url: `/getStudents`,
        method: 'get',
        acc: getStudents
    },
    {
        url: `/getSubject`,
        method: 'get',
        acc: getSubject
    },
    {
        url: `/removeStudent`,
        method: 'get',
        acc: removeStudent
    },
];

/* eslint-enable */

//挂载路由
routers.forEach(item => {
    router[item.method](item.url, item.acc);
});

module.exports = router;

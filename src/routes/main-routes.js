//主路由文件
import KoaRouter from 'koa-router';
import controllers from '../controllers/index.js';

//所有的API接口都以apiv1开头
const router = new KoaRouter({ prefix: '/v1' });
const {
    Demos,
    Users,
    Login,
    Admin,
    Files,
    Common,
    Teacher,
    Student
} = controllers;

const routers = [{
        url: `/test`,
        routes: Demos.TestController
    },
    {
        url: `/user`,
        routes: Users.UserController
    },
    {
        url: `/login`,
        routes: Login.LoginController
    },
    {
        url: `/platform`,
        routes: Admin.PlatformController
    },
    {
        url: `/permission`,
        routes: Admin.PermissionController
    },
    {
        url: `/files`,
        routes: Files.FileController
    },
    {
        url: `/common`,
        routes: Common.CommonController
    },
    {
        url: `/teacher/subject`,
        routes: Teacher.SubjectController
    },
    {
        url: `/teacher/check`,
        routes: Teacher.CheckController
    },
    {
        url: `/teacher/result`,
        routes: Teacher.ResultController
    },
    {
        url: `/student/subject`,
        routes: Student.SubjectController
    },
    {
        url: `/student/check`,
        routes: Student.CheckController
    },
    {
        url: `/student/result`,
        routes: Student.ResultController
    }
];

//挂载路由
routers.forEach(item => {
    router.use(item.url, item.routes.routes(), item.routes.allowedMethods());
});
export default router;

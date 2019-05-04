import result from '../../tools/Result';
import Utils from '../../tools/Utils';
import SubjectModel from '../../models/SubjectModel';
import UserSubModel from '../../models/UserSubModel';
import ResultModel from '../../models/ResultModel';
import moment from 'moment';

/**
 * SubjectService
 * 本页面处理业务逻辑 接收参数与返回处理结果
 */
module.exports = class SubjectService {

    /**
     * 添加课堂
     * @param {*} user
     */
    async addSubject(jwt, subject) {
        //检查用户是否为老师
        if (!Utils.isTeacher(jwt)) {
            return result.failed('无权限操作', 403);
        };
        let { name, date, begin, end, location, openjoin = '0', remark, weeks } = subject;
        let params = {
            name, date, begin, end, location, openjoin, weeks
        };
        // 检测参数是否存在为空
        for (let item in params) {
            if (params[item] === undefined) {
                return result.paramsLack('错误: 参数: ' + item + '不能为空', 412, '');
            }
        }
        params.remark = remark;
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        params.teacher = data.username;
        params.teacherno = data.sno;
        try {
            // 查询课程名是否重复,重复就在原课堂上创建新的节数
            const existSubject = await SubjectModel.subname(params.name, params.teacherno);
            if (existSubject) {
                params.password = existSubject[0].password;
                params.openjoin = existSubject[0].openjoin;
                params.remark = existSubject[0].remark;
            } else {
                //初始化课程邀请码
                let exitPassword = true;
                do {
                    params.password = Math.round(Utils.getRandomNum() / 100);
                    let result = await SubjectModel.selectByPassword(params.password);
                    if (!result) {
                        exitPassword = false;
                    }
                } while (exitPassword);
            }

            //初始化每节课的时间
            let subjects = []; let day = moment(params.date);
            for (let i = 0; i < params.weeks; i++) {
                subjects[i] = Utils.deepCloneObject(params);
                subjects[i].date = day.add(i * 7, 'days').format('YYYY-MM-DD');
            }
            await SubjectModel.createMany(subjects);
            return result.success('创建成功');

        } catch (err) {
            return result.failed(err, 500);
        }
    }

    /**
     * 某节课程信息修改或删除
     * @param {*} user data isDelete
     */
    async updateOrDeleteSubject(jwt, { id, date, begin, end, location }, isDelete) {
        //检查用户是否为老师
        if (!Utils.isTeacher(jwt)) {
            return result.failed('无权限操作', 403);
        };
        if (!id) {
            return result.failed('id不能为空', 412);
        }
        console.log(id);
        try {
            if (isDelete) {
                await SubjectModel.delete(id);
                return result.success('删除成功');
            } else {
                if (!date || !begin || !end || !location) {
                    return result.failed('参数不能为空', 412);
                }
                await SubjectModel.update(id, { date, begin, end, location });
                return result.success('修改成功');
            }
        } catch (err) {
            return result.failed(err, 500);
        }
    }

    /**
     * 修改某课程信息
     * @param {*} user data isDelete
     */
    async updateSubject(jwt, subject) {
        //检查用户是否为老师
        if (!Utils.isTeacher(jwt)) {
            return result.failed('无权限操作', 403);
        };
        let { password, name, date, begin, end, location, openjoin, status = '0', remark, weeks } = subject;
        let params = {
            password, name, date, begin, end, location, openjoin, status, weeks
        };
        // 检测参数是否存在为空
        for (let item in params) {
            if (params[item] === undefined) {
                return result.paramsLack('错误: 参数: ' + item + '不能为空', 412, '');
            }
        }
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        params.teacher = data.username;
        params.teacherno = data.sno;
        try {
            const oldSubject = await SubjectModel.selectByPassword(password);
            if (!oldSubject) {
                return result.failed('该课程不存在');
            }
            // 查询课程名是否重复
            const existSubject = await SubjectModel.subname(name, params.teacherno);
            if (existSubject && existSubject.password != password) {
                return result.failed('该课程名字已经存在', 403);
            }
            params.password = password; params.remark = remark;
            //删除原来的课程
            await SubjectModel.deleteAll(oldSubject.name, oldSubject.teacherno);
            //设定每节课的时间
            let subjects = []; let day = moment(params.date);
            for (let i = 0; i < params.weeks; i++) {
                subjects[i] = Utils.deepCloneObject(params);
                subjects[i].date = day.add(i * 7, 'days').format('YYYY-MM-DD');
            }
            //重新创建课程
            await SubjectModel.createMany(subjects);
            return result.success('修改成功');
        } catch (err) {
            return result.failed(err, 500);
        }
    }

    /**
     * 删除某课程
     * @param {*} user
     */
    async deleteAllSubject(jwt, { name }) {
        //检查用户是否为老师
        if (!Utils.isTeacher(jwt)) {
            return result.failed('无权限操作', 403);
        };
        if (name === undefined) {
            return result.failed('参数name不能为空', 412);
        }
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        let teacherno = data.sno;
        try {
            await SubjectModel.deleteAll(name, teacherno);
            return result.success('删除成功');
        } catch (err) {
            return result.failed(err, 500);
        }
    }

    /**
     * 查询某一天的课程,默认返回当天的课程
     * @param {*} user
     */
    async getSubjectBydate(jwt, { date, page = 1 }) {
        //检查用户是否为老师
        if (!Utils.isTeacher(jwt)) {
            return result.failed('无权限操作', 403);
        };
        if (date === undefined) {
            date = moment().format('YYYY-MM-DD');
        }
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        let teacherno = data.sno;
        try {
            let subjects = await SubjectModel.findByDate(date, teacherno);
            let ids = [];
            for (let items in subjects) {
                ids.push(subjects[items].id);
            }
            let signIn = await ResultModel.findByPasswordTno(ids, teacherno, page);
            return result.success('查询成功', { data: subjects, sign: signIn });
        } catch (err) {
            return result.failed(err, 500);
        }
    }

    /**
     * 更改课程加入权限
     * @param {*} name openJoin
     */
    async setOpenJoin(jwt, { name, openJoin = '0' }) {
        //检查用户是否为老师
        if (!Utils.isTeacher(jwt)) {
            return result.failed('无权限操作', 403);
        };
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        let teacherno = data.sno;
        try {
            console.log(name);
            SubjectModel.updateOpenJoin(name, teacherno, openJoin);
            return result.success('修改成功');
        } catch (err) {
            return result.failed(err, 500);
        }
    }
    /**
     * 更新课程签到状态
     * @param {*} name openJoin
     */
    async updateCheckStatus(jwt, { id }, status) {
        //检查用户是否为老师
        if (!Utils.isTeacher(jwt)) {
            return result.failed('无权限操作', 403);
        };
        if (!id) {
            return result.failed('参数id不能为空', 412);
        };
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        let teacherno = data.sno;
        try {
            await SubjectModel.updateStatus(id, teacherno, { status });
            return result.success('已更改');
        } catch (err) {
            console.log(err);
            return result.failed(err, 500);
        }
    }
    /**
     * 获取用户列表
     * @param {*} ctx password
     */
    async getUserList(jwt, { password }) {
        //检查用户是否为老师
        if (!Utils.isTeacher(jwt)) {
            return result.failed('无权限操作', 403);
        };
        try {
            let studens = await UserSubModel.findByPassword(password);
            return result.success('查询成功', studens);
        } catch (error) {
            console.log(error);
            return result.failed();
        }
    }
    /**
     * 获取课程信息
     * @param {*} ctx name
     */
    async getSubject(jwt, { name, page = 1, id }) {
        //检查用户是否为老师
        if (!Utils.isTeacher(jwt)) {
            return result.failed('无权限操作', 403);
        };
        if (name === undefined) {
            return result.failed('参数name不能为空', 412);
        }
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        let teacherno = data.sno;
        try {
            let subjects = [];
            if (id) {
                subjects = await SubjectModel.searchById(id);
                if (subjects.teacherno !== teacherno) {
                    return result.failed('该课程不存在', 404);
                };
            } else {
                subjects = await SubjectModel.subname(name, teacherno);
            }
            let signIn = await ResultModel.findByPasswordTno([ subjects.id ], teacherno, page);
            return result.success('查询成功', { data: subjects, sign: signIn });
        } catch (error) {
            console.log(error);
            return result.failed();
        }
    }
    /**
     * 移除课程某个学生
     * @param {*} ctx name
     */
    async removeStudent(jwt, { name, sno }) {
        //检查用户是否为老师
        if (!Utils.isTeacher(jwt)) {
            return result.failed('无权限操作', 403);
        };
        if (!name || !sno) {
            return result.paramsLack('参数不能为空', 412, '');
        };
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        let teacherno = data.sno;
        try {
            let subject = await SubjectModel.subname(name, teacherno);
            if (!subject) {
                return result.failed('该课程不存在');
            };
            await UserSubModel.delete(sno, subject.password);
            return result.success('成功将该学生移除课程');
        } catch (error) {
            console.log(error);
            return result.failed();
        }
    }
    /**
     * 获取某一课程学生的签到情况
     * @param {*} ctx name
     */
    async getSinIn(jwt, { password }) {
        //检查用户是否为老师
        if (!Utils.isTeacher(jwt)) {
            return result.failed('无权限操作', 403);
        };
        if (!password) {
            return result.paramsLack('参数不能为空', 412, '');
        };
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        let teacherno = data.sno;
        try {
            let subject = await ResultModel.findByPassword(password, teacherno);
            return result.success('查询成功', subject);
        } catch (error) {
            console.log(error);
            return result.failed();
        }
    }
};

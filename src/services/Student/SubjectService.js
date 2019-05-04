import result from '../../tools/Result';
import Utils from '../../tools/Utils';
import SubjectModel from '../../models/SubjectModel';
import UserSubModel from '../../models/UserSubModel';
import ResultModel from '../../models/ResultModel';
import moment from 'moment';

/**
 * test TestService
 * 本页面处理业务逻辑 接收参数与返回处理结果
 */
module.exports = class SubjectService {

    /**
     * 查找课程
     * @param {*} params type
     */
    async searchSubject(jwt, { params, type }) {
        if (params === undefined) {
            return result.failed('参数不能为空', 412);
        }
        try {
            let subject = {};
            if (type == 'id') {
                subject = await SubjectModel.searchById(params);
            } else if (type == 'password') {
                subject = await SubjectModel.selectByPassword(params);
            } else {
                //默认通过课程名查找
                subject = await SubjectModel.search(params);
            }
            if (subject) {
                //获取当前用户信息
                const data = Utils.getJwtData(jwt);
                let sno = data.sno;
                let resultSub = await this.getSignin(subject, sno);
                return result.success('查找成功', resultSub);
            }
            return result.failed('没有找到该课程', 404);
        } catch (err) {
            console.log(err);
            return result.failed(err, 500);
        }
    }

    /**
     * 加入课程
     * @param {*} params type
     */
    async joinSubject(jwt, { password }) {
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        let sno = data.sno;
        try {
            const subject = await SubjectModel.selectByPassword(password);
            if (!subject) {
                return result.failed('该课程不存在', 404);
            }
            if (subject.openjoin == '1') {
                return result.failed('该课程暂时不允许加入，请联系该课程老师', 233);
            }
            console.log(data);
            await UserSubModel.create(sno, password);
            return result.success('加入课程成功');
        } catch (err) {
            return result.failed(err, 500);
        }
    }

    /**
     * 查询某一天的课程,默认返回当天的课程
     * @param {*} user
     */
    async getSubjectBydate(jwt, { date }) {
        if (date === undefined) {
            date = moment().format('YYYY-MM-DD');
        }
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        let sno = data.sno;
        try {
            let usersubs = await UserSubModel.findBySno(sno);
            if (!usersubs) {
                return result.failed('你还没有加入任何课程，快去加入吧');
            };
            let passwords = [];
            for (let items in usersubs) {
                passwords.push(usersubs[items].password);
            }
            let subjects = await SubjectModel.selectByPasswordsDate(passwords, date);
            let resultSub = await this.getSignin(subjects, sno);
            return result.success('查询成功', resultSub);
        } catch (err) {
            return result.failed(err, 500);
        }
    }

    /**
     * 查询某一段时间的课程,默认返回当天的课程
     * @param {*} user
     */
    async getSubjectByDates(jwt, { begin, end }) {
        if (begin === undefined) {
            begin = moment().format('YYYY-MM-DD');
        }
        if (end === undefined) {
            end = moment().format('YYYY-MM-DD');
        }
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        let sno = data.sno;
        try {
            let usersubs = await ResultModel.findBySnoDate(sno, begin, end);
            if (!usersubs) {
                return result.success('没有任何历史记录');
            };
            return result.success('查询成功', usersubs);
        } catch (err) {
            console.log(err);
            return result.failed(err, 500);
        }
    }

    /**
     * 查询所有的课程
     * @param {*} user
     */
    async getSubjects(jwt, { page = 1 }) {
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        let sno = data.sno;
        try {
            let usersubs = await UserSubModel.findBySno(sno);
            if (!usersubs) {
                return result.failed('你还没有加入任何课程，快去加入吧');
            };
            let passwords = [];
            for (let items in usersubs) {
                passwords.push(usersubs[items].password);
            }
            let subjects = await SubjectModel.selectByPasswords(passwords, page);
            console.log(subjects);
            let resultSub = await this.getSignin(subjects.rows, sno);
            return result.success('查询成功', { rows: resultSub, count: subjects.count });
        } catch (err) {
            return result.failed(err, 500);
        };
    }

    /**
     * 学生签到
     * @param {*} user
     */
    async Signin(jwt, { id }) {
        let results = {};
        //获取当前用户信息
        const data = Utils.getJwtData(jwt);
        results.sno = data.sno;
        try {
            let subject = await SubjectModel.searchById(id);
            if (!subject) {
                return result.failed('该课程不存在！', 404);
            };
            let usersub = await UserSubModel.findBySnoPassword(results.sno, subject.password);
            if (!usersub) {
                return result.failed('您还未加入该课程');
            };
            if (subject.status != '1') {
                return result.failed('该课程没有在进行点名');
            };
            results.password = subject.password;
            results.subid = subject.id;
            results.teacherno = subject.teacherno;
            results.status = 1;
            results.name = subject.name;
            results.date = moment().format('YYYY-MM-DD');
            console.log(results);
            await ResultModel.create(results);
            return result.success('签到成功');
        } catch (err) {
            console.log(err);
            return result.failed(err, 500);
        }
    }

    /**
     * 获取课程签到记录
     * @param {*} user
     */
    async getSignin(subject, sno) {
        let resultSub = [];
        if (subject[0]) {
            for (let i = 0; i < subject.length; i++) {
                let signin = await ResultModel.findByPasswordSno(subject[i].id, sno);
                let { id, name, date, begin, end, location, openjoin, status, teacher, teacherno, password } = subject[i];
                resultSub[i] = { id, name, date, begin, end, location, openjoin, status, teacher, teacherno, password, signin };
            }
        } else {
            let signin = await ResultModel.findByPasswordSno(subject.id, sno);
            let { id, name, date, begin, end, location, openjoin, status, teacher, teacherno, password } = subject;
            resultSub[0] = { id, name, date, begin, end, location, openjoin, status, teacher, teacherno, password, signin };
        }
        return resultSub;
    }
};

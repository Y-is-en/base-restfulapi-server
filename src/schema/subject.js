/**
 * 课程数据模型
 * @param {*} sequelize
 * @param {*} DataTypes
 * 此模型仅限关系型数据库使用
 */
export default (sequelize, DataTypes) => {
    return sequelize.define('subject', {
        //id
        id: {
            type: DataTypes.BIGINT(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        //课程名
        name: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //日期
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        //课程开始时间
        begin: {
            type: DataTypes.TIME(),
            allowNull: true
        },

        //课程结束时间
        end: {
            type: DataTypes.TIME(),
            allowNull: true
        },

        //上课地点
        location: {
            type: DataTypes.STRING(32),
            allowNull: true
        },

        //是否开放学生加入
        openjoin: {
            type: DataTypes.STRING(32),
            allowNull: true
        },

        //课程签到状态
        status: {
            type: DataTypes.STRING(32),
            allowNull: true,
            defaultValue: '0'
        },

        //课程老师
        teacher: {
            type: DataTypes.STRING(32),
            allowNull: true
        },

        //课程老师教职工编号
        teacherno: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //课程邀请码
        password: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //课程备注
        remark: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //创建时间
        createdAt: {
            type: DataTypes.INTEGER(16),
            allowNull: false,
            defaultValue: Date.parse(new Date()) / 1000
        },

        //修改时间
        updatedAt: {
            type: DataTypes.INTEGER(16),
            allowNull: false,
            defaultValue: Date.parse(new Date()) / 1000
        }
    }, {
        tableName: 'subject'
    });
};

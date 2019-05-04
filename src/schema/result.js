/**
 * 签到结果数据模型
 * @param {*} sequelize
 * @param {*} DataTypes
 * 此模型仅限关系型数据库使用
 */
export default (sequelize, DataTypes) => {
    return sequelize.define('result', {
        //id
        id: {
            type: DataTypes.BIGINT(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        //学号
        sno: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //课程id
        subid: {
            type: DataTypes.BIGINT(11),
            allowNull: false
        },

        //课程名称
        name: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //日期
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        //课程邀请码
        password: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //课程老师教职工编号
        teacherno: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //签到状态
        status: {
            type: DataTypes.INTEGER(32),
            allowNull: true
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
        tableName: 'result'
    });
};

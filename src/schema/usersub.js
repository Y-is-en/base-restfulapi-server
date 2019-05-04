/**
 * 用户-课程关系数据模型
 * @param {*} sequelize
 * @param {*} DataTypes
 * 此模型仅限关系型数据库使用
 */
export default (sequelize, DataTypes) => {
    return sequelize.define('userSubject', {
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

        //课程邀请码
        password: {
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
        tableName: 'usersub'
    });
};

/**
 * 用户数据模型
 * @param {*} sequelize
 * @param {*} DataTypes
 * 此模型仅限关系型数据库使用
 */
export default (sequelize, DataTypes) => {
    return sequelize.define('user', {
        //id
        id: {
            type: DataTypes.BIGINT(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        //用户名
        name: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //学号/教职工编号
        sno: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //密码
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        //班级信息
        classes: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //班级信息
        image: {
            type: DataTypes.STRING(32),
            allowNull: false
        },

        //是否删除 true是 false否
        type: {
            type: DataTypes.INTEGER(2),
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
        tableName: 'user'
    });
};

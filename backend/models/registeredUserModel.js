module.exports = (sequelize, DataTypes) => {

    const RegisteredUser = sequelize.define("registered_user", {
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING, 
            allowNull: false
        }, 
        phone_number: {
            type: DataTypes.STRING, 
            allowNull: false,
            unique: true
        }, 
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 
        password: {
            type: DataTypes.STRING, 
            allowNull: false
        }, 
        spam: {
            type: DataTypes.BOOLEAN,
        }, 

    })

    return RegisteredUser
}
module.exports = (sequelize, DataTypes) => {

    const NotRegisteredUser = sequelize.define("not_registered_user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING, 
        }, 
        phone_number: {
            type: DataTypes.STRING, 
        }, 
        email: {
            type: DataTypes.STRING,
        },
        spam: {
            type: DataTypes.BOOLEAN,
        }, 

    })

    return NotRegisteredUser
}
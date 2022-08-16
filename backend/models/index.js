const dbConfig = require("../config/dbConfig");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorAliases: false,
  define: {
    timestamps: false,
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => console.log("DB Connected Successfull"))
  .catch((e) => console.log("Error in Connecting to DB", e));

  const db = {}

  db.Sequelize = Sequelize
  db.sequelize = sequelize

  db.registeredUsers = require("./registeredUserModel.js")(sequelize, DataTypes)
  db.notRegisteredUsers = require("./notRegisteredUserModel.js")(sequelize, DataTypes)


  db.sequelize.sync({force: false})
  .then(() => console.log("DB re sync done successfully"))
  .catch(() => console.log("DB re sync unsuccessful"))


  // DB Association and Relation

  module.exports = db
const { validationResult } = require("express-validator");
const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const RegisteredUser = db.registeredUsers;
const NotRegisteredUser = db.notRegisteredUsers;

const register = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.body);
  const salt = await bcrypt.genSalt(10);
  const securedPasswd = await bcrypt.hash(req.body.password, salt);

  let info = {
    name: req.body.name,
    phone_number: req.body.phone_number,
    email: req.body.email || "",
    password: securedPasswd,
    spam: false,
  };

  try {
    const ans = await RegisteredUser.create(info);
    res.status(200).send({ message: "User Created Successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: "User Not Created" });
  }
};

// login a user
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { name, password } = req.body;
  try {
    let user = await RegisteredUser.findOne({ where: { name: req.body.name } });
    console.log(user)
    console.log(user.password)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Please try to login with correct Credentials",
      });
    }
   console.log("before comparing")
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        error: "Please try to login with correct Credentials",
      });
    }
    console.log("after comapring")  
    const data = {
      name: user.name,
      phone_number: user.phone_number,
    };
    const authToken = jwt.sign(data, process.env.SECRET_KEY);
    res.status(200).json({ success: true, authToken });

    res.cookie("jwt-token", authToken, {
      httpOnly: true,
      secure: true,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error :(");
  }
};

// APIs to be called only after logging in

const markSpam = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const updatedUser = await RegisteredUser.update(
      { spam: true },
      {
        where: {
          phone_number: req.body.number_to_mark_spam,
        },
      }
    );

    if (!updatedUser) {
      const NotRegisteredUpdateUser = await NotRegisteredUser.update(
        { spam: true },
        {
          where: {
            phone_number: req.body.number_to_mark_spam,
          },
        }
      );

      res.status(500).send({ error: "User Not Updated" });
    }

    res.status(200).send({ message: "User Updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error :(");
  }
};

// Search

const search = async (req, res) => {
  try {
    const value = Object.keys(req.query)[0];

    if (value == "name") {
      let searchedName = req.query.name.toLowerCase();
      var userData = [];

      let registeredUser_With_Exact_Match = RegisteredUser.findAll({
        where: {
          name: searchedName,
        },
      });

      userData.push(registeredUser_With_Exact_Match);

      let notRegisteredUser_With_Exact_Match = NotRegisteredUser.findAll({
        where: {
          name: searchedName,
        },
      });

      userData.push(notRegisteredUser_With_Exact_Match);

      let registeredUser_With_Partial_Match = RegisteredUser.findAll({
        where: {
          name: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("name")),
            "LIKE",
            "%" + searchedName + "%"
          ),
        },
      });

      userData.push(registeredUser_With_Partial_Match);

      let notRegisteredUser_With_Partial_Match = NotRegisteredUser.findAll({
        where: {
          name: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("name")),
            "LIKE",
            "%" + searchedName + "%"
          ),
        },
      });

      userData.push(notRegisteredUser_With_Partial_Match);

      res.status(200).send(userData);

    } else if (value == "phone_number") {
      let searchedNumber = req.query.phone_number;
      var userData = [];

      let registeredUser = RegisteredUser.findAll({
        where: {
          phone_number: searchedNumber,
        },
      });

      if (!registeredUser) {
        let notRegisteredUser = NotRegisteredUser.findAll({
          where: {
            phone_number: searchedNumber,
          },
        });

        if(!notRegisteredUser){
          res.status(404).send({message: "Requested Data Not Found in the Database"})
        }
        userData.push(notRegisteredUser);
        res.status(200).send(userData);
      }else{
        userData.push(registeredUser);
        res.status(200).send(userData);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({error})
  }
};

module.exports = {
  register,
  login,
  markSpam,
  search,
};

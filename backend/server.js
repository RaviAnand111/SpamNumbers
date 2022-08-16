require('dotenv').config(".env");
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/userRouter");
const userController = require("./controllers/userController")

const app = express();

const PORT = process.env.PORT || 8080;
// app.use(
//     cors({
//       origin: ["http://localhost:3000"],
//       methods: ["GET", "POST", "DELETE"],
//       credentials: true,
//     })
//   );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/SpamCheck/", router);
// app.post("/markspam", userController.markSpam);

app.get("/", (req, res) => {
    res.status(200).send({message: "Server Working Fine"})
    // res.send("Hello World")
})


app.listen(8080,() => {
    console.log(`Listening to PORT 8080 ${PORT}`);
})
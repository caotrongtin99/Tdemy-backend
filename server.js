const express = require("express");
require("dotenv").config();
const app = express();
const logger = require("./utils/log");
//Log request
const morgan = require('morgan');
app.use(morgan("dev", {
  skip: (req, res) =>{
    return req.baseUrl === "/" || req.baseUrl === "";
  }
}));

const cors = require("cors");
app.use(cors());
//Use body parser
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "5mb" }));

//Config route
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/user.route"));
app.use("/api/courses", require("./routes/course.route"));
app.use("/api/wishlist", require("./routes/wishList.route"));
app.use("/api/enroll", require("./routes/enroll.route"));
app.use("/api/search", require("./routes/search.route"));
app.use("/api/category", require("./routes/category.route"));
app.use("/api/session", require("./routes/session.route"));
app.use("/", function (req, res) {
  res.json("Ok");
});
app.use(function (req, res, next) {
  res.status(404).send({
    message: "Resource not found!",
  });
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })
const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';
app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
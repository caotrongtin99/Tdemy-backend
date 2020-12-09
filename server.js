const express = require("express");
const models = require("./models");
const config = require("dotenv");

const app = express();

//Log request
const logger = require('morgan');
app.use(logger('dev'));

var cors = require("cors");
app.use(cors());

//Use body parser
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "5mb" }));

//Config route
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/user", require("./routes/user.route"));
app.use("/api/course", require("./routes/course.route"));
app.use("/api/feedback", require("./routes/feedback.route"));
app.use("/api/wishlist", require("./routes/wishList.route"));
app.use("/api/chapter", require("./routes/chapter.route"));

app.use(function (req, res, next) {
  res.status(404).send({
    message: "Resource not found!",
  });
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })
const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
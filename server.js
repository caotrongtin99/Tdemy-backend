const express = require("express");
const models = require("./models");
const config = require("dotenv");

const app = express();
var cors = require("cors");

app.use(cors());
//Use body parser
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "5mb" }));

//Config route
app.use("/api", require("./routes/auth.route"));
app.use("/api/user", require("./routes/user.route"));


app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })
const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
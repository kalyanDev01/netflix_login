const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
let arr = [];

app.use(cors());
app.use(express.json());

app.post("/signup", function (req, res) {
  // debugger;
  // console.log(arr);
  const creds = req.body.creds;
  // console.log("creds = "+creds)

  // Check if creds exists
  const userExists = arr.some((user) => user.creds === creds);

  if (userExists) {
    return res.json({
      status: true,
      msg: "Email already exists",
    });
  }

  const tempPassword = crypto.randomBytes(5).toString("hex");
  const user = {
    creds,
    tempPassword
  };
  arr.push(user);

  res.json({
    status: false,
    msg: "Temp password generated",
    tempPassword,
  });
});

app.listen(5000, function () {
  console.log("Server started");
});

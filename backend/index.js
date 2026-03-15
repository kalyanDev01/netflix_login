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

const PORT = process.env.PORT || 5000;
console.log(PORT);
app.listen(PORT, function () {
  console.log("Server started");
});

app.post("/signin", function (req, res) {
  const creds = req.body.creds;
  const password = req.body.password;

  const user = arr.find((u) => u.creds === creds);
  console.log(user);

  if (!user) {
    return res.json({
      status: false,
      msg: "User not found"
    });
  }

  if (user.tempPassword === password) {
    console.log("Success");
    return res.json({
      status: true,
      msg: "Login successful"
    });
  } else {
    console.log("login failure");
    return res.json({
      status: false,
      msg: "Wrong temporary password"
    });
  }
});

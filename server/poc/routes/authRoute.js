const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

//route to sign up
router.post("/signup", async (req, res) => {
  try {
    const token = jwt.sign({ userId: "123" }, "SECRET KEY"); //need to generate a randome secret key
    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

//route to login

module.exports = router;

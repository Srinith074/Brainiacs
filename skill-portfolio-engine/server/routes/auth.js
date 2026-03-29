const router = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "dev-secret";

router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
    function (err) {
      if (err) return res.status(400).send("User exists");
      res.send({ id: this.lastID });
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, user) => {
      if (!user) return res.status(401).send("Invalid");

      const token = jwt.sign({ id: user.id }, SECRET);
      res.send({ token });
    }
  );
});

module.exports = router;

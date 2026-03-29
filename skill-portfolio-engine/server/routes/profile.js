const router = require("express").Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { userId, data } = req.body;

  db.run(
    "INSERT OR REPLACE INTO profiles (userId, data) VALUES (?, ?)",
    [userId, JSON.stringify(data)],
    () => res.send("Saved")
  );
});

router.get("/:userId", (req, res) => {
  db.get(
    "SELECT data FROM profiles WHERE userId=?",
    [req.params.userId],
    (err, row) => {
      res.send(row ? JSON.parse(row.data) : {});
    }
  );
});

module.exports = router;

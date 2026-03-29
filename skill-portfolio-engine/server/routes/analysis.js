const router = require("express").Router();
const { analyze } = require("../utils/engine");

router.post("/", (req, res) => {
  const result = analyze(req.body);
  res.send(result);
});

module.exports = router;

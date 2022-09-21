const { Router } = require("express");
const router = Router();

router.use("/items", require("./items"));
router.use("/movies", require("./movies"));

module.exports = router;

const { Router } = require("express");
const router = Router();

router.use("/movies", require("./movies"));
router.use("/weather", require("./weather"));
router.use("/users", require("./users"));
router.use("/", (req, res) => res.status(404).send("Route not found. Maybe you meant /movies"))
module.exports = router;

const express = require("express");
const router = express.Router();

const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

router.get("/:channel/:ym", (req, res) => {
    logger.debug(req.params);
    res.render("home");
});

module.exports = router;

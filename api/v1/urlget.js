var express = require("express");
var router = express.Router();

var redisClient = require("../../redis-client");

router.get("/", async (req, res) => {
    res.send({ "msg": "hello world" });
});

router.get("/:hash", async (req, res) => {
    const get_url = await redisClient.get(req.params.hash);
    if (get_url !== null) {
        res.status(200).send(get_url);
        // res.status(302).redirect(get_url);
    } else {
        const errors = [
            {
                "msg": "URL is expired or invalid",
            },
        ];
        res.status(400).send(errors);
    }
});

module.exports = router;

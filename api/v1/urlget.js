var express = require('express');
var router = express.Router();

var redisClient = require('../../redis-client');

router.get("/:hash", async (req, res) => {

    const get_url = await redisClient.get(req.params.hash);
    if (get_url !== null) {
        res.status(301).redirect(get_url);
    } else {
        const errors = [
            {
                "msg": "URL is expired or invalid",
            }
        ];
        res.status(400).send(errors);
    }
});

module.exports = router;
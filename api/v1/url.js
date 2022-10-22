var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var SHA256 = require("crypto-js/sha256");
var ENCBASE64 = require("crypto-js/enc-base64");


var redisClient = require('../../redis-client');

router.get("/:hash", async (req, res) => {
    res.send(req.params.hash);
});

router.post("/", [
    check('original_url').isURL(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // Domain name
    var domain_name = req.get("host");

    // Request payload
    var data = req.body;

    // Original URL
    var original_url = data.original_url;

    // if http protocol ignored, added to it manually.
    if (!original_url.includes("http")) {
        original_url = "http://" + original_url;
    }

    // SHA256 the original URL
    const url_sha256 = SHA256(original_url);

    // ENCBASE64 the SHA256 string
    const sha256_encbase64 = ENCBASE64.stringify(url_sha256);

    // First 7 bytes of the base64 encoded string
    const shorten_string = sha256_encbase64.slice(0, 7);


    const get_url = await redisClient.get(shorten_string);

    if (get_url === null) {
        const create_url = await redisClient.set(shorten_string, original_url,
            {
                EX: data.ttl ? data.ttl : 60 * 60 * 24 * 7,
                NX: true
            });
    }

    const [setKeyReply, otherKeyValue] = await redisClient.multi().ttl(shorten_string).get(shorten_string).exec();

    const expiresAt = (Date.parse(new Date) / 1000 + setKeyReply) * 1000;

    const parsed = new Date(expiresAt).toString();

    console.log(setKeyReply, typeof parsed);

    const aliases = [{
        alias: shorten_string,
        // created_at:
        expires_at: parsed,
        domain: domain_name,
        read_only: true,
        "shorten_url": `${domain_name}/${shorten_string}`
    }];

    const resData = {
        "original_url": original_url,
        "aliases": aliases,
    };

    res.status(201).send(resData);
})

module.exports = router;

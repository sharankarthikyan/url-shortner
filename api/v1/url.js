var express = require('express');
var router = express.Router();
const { check } = require('express-validator');
var SHA256 = require("crypto-js/sha256");
var ENCBASE64 = require("crypto-js/enc-base64");


var redisClient = require('../../redis-client');
var validator = require("../v1/validation-layer/error");

router.get("/:hash", async (req, res) => {
    res.send(req.params.hash);
});

router.post("/", [
    check('original_url').isURL(),
], async (req, res) => {
    validator(req, res);

    // Domain name
    var domain_name = req.get("host");

    // Request payload
    var data = req.body;

    // Original URL
    var original_url = data.original_url;

    // SHA256 the original URL
    const url_sha256 = SHA256(original_url);

    // ENCBASE64 the SHA256 string
    const sha256_encbase64 = ENCBASE64.stringify(url_sha256);

    // First 7 bytes of the base64 encoded string
    const shorten_string = sha256_encbase64.slice(0, 7);

    const aliases = [{
        alias: shorten_string,
        created_at: new Date(),
        domain: domain_name,
        expires_at: null,
        read_only: true,
        "shorten_url": `${domain_name}/${shorten_string}`
    }]
    const resData = {
        "original_url": original_url,
        "aliases": aliases,
    };

    res.status(201).send(resData);

    // const d = await redisClient.set("dasda", "asdasdas");
})

module.exports = router;

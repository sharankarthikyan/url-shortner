var express = require('express');
var router = express.Router();

router.get("/:hash", async (req, res) => {
    res.send(req.params.hash);
});

module.exports = router;
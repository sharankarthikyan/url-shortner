const { check, validationResult } = require('express-validator');

function validate(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
}

module.exports = validate;
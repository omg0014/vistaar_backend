'use strict';
// ObjectId.isValid() also accepts any bare 12-character string (a legacy BSON
// looseness), so it's checked against the strict 24-char hex form instead.
const HEX24 = /^[0-9a-f]{24}$/i;

module.exports = function validateObjectId(...params) {
  return function (req, res, next) {
    for (const param of params) {
      if (!HEX24.test(req.params[param] || '')) {
        return res.status(400).json({ error: `Invalid ${param}` });
      }
    }
    next();
  };
};

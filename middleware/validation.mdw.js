const ajv = require('ajv');

module.exports = schema => (req, res, next) => {
  const validator = new ajv({ allErrors: true });
  const validate = validator.compile(schema);
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).json(validate.errors);
  }

  next();
}
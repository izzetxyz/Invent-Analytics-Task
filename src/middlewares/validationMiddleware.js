const Joi = require('joi');


const validateObjectId = (id) => {
  const numericIdPattern = /^[1-9]\d*$/;
  return numericIdPattern.test(id);
};


const validateUserId = (req, res, next) => {
  if (!validateObjectId(req.params.userId)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID format' });
  }
  next();
};

const validateBookId = (req, res, next) => {
  if (!validateObjectId(req.params.bookId)) {
    return res.status(400).json({ success: false, message: 'Invalid book ID format' });
  }
  next();
};

const validateCreateUser = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  next();
};

const validateCreateBook = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  next();
};

module.exports = {
  validateUserId,
  validateBookId,
  validateCreateUser,
  validateCreateBook
};

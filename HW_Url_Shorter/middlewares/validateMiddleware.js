import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  surname: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const urlSchema = Joi.object({
  name: Joi.string().required(),
  originalUrl: Joi.string().uri().required(), //  http://example.com
});

export const validateMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) { 
    return res.status(400).send({ message: error.details[0].message });
  }
  next();
};

import Joi from "joi";

const passwordCheck = (value, helpers) => {
  if (value.length < 8)
    return helpers.message("Password must be at least 8 characters");
  if (value.length > 72) return helpers.message("Password too long");
  return value;
};

const signup = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().custom(passwordCheck),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export { signup, login };

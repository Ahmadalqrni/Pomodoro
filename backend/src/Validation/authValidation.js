import Joi from "joi";

const passwordCheck = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message({
      custom: "Password must be at least 8 characters",
    });
  }

  if (value.length > 72) {
    return helpers.message({
      custom: "Password too long",
    });
  }

  return value;
};

const signupValidation = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.min": "Name must be at least 2 characters long",
  }),
  email: Joi.string().email().required(),
  password: Joi.string().custom(passwordCheck).required(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().custom(passwordCheck).required(),
});

export { signupValidation, loginValidation };

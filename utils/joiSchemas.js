const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);


const joiUserSchema = Joi.object({
    username: Joi.string().required().alphanum(),
    password: Joi.string().required().min(8).max(30),
    repeat_password: Joi.ref('password'),
    profilePicture: Joi.string().required(),
    email: Joi.string().required()
}).required();

const joiPostSchema = Joi.object({
    text: Joi.string().required()
}).required();

const usernameSearchSchema = Joi.object({
    username: Joi.string().required().alphanum()
}).required();

const movieSearchSchema = Joi.object({
    movieName: Joi.string().required().alphanum()
}).required();

const bioSchema = Joi.object({
    bio: Joi.string().required().alphanum()
}).required()

module.exports = { joiUserSchema , joiPostSchema }
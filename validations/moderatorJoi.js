import Joi from "joi";

// Validation function using Joi with custom logic 
const validateModeratorData = async (data) => {
    const schema = Joi.object({
        fullname: Joi.string()
            .min(3)
            .max(50)
            .pattern(/^[a-zA-Z\s]+$/)
            .trim()
            .custom((value, helpers) => {
                const words = value.split(' ');
                if (words.length < 2) {
                    return helpers.error('any.custom', { message: 'Name must contain at least two words' });
                }
                return value;
            })
            .required(),
        mobile: Joi.string()
            .pattern(/^\d{10}$/)
            .required()
            .messages({
                "string.empty": "Mobile number is required.",
                "string.pattern.base": "Mobile number must be a 10-digit number.",
            }),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .lowercase()
            .pattern(/(\<|^)[\w\d._%+-]+@(?:[\w\d-]+\.)+(\w{2,})(\>|$)/i)
            .required()
            .messages({
                "string.empty": "Email is required.",
                "string.pattern.base": "Please enter valid email.",
            }),
        shopName: Joi.string()
            .required(),
        password: Joi.string()
            .min(8)
            .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&.*]{8,100}$'))
            .custom((value, helpers) => {
                if (value.toLowerCase().includes('password')) {
                    return helpers.error('any.custom', { message: 'Password must not contain the word "password"' });
                }
                return value;
            })
            .custom((value, helpers) => {
                const email = helpers.state.ancestors[0].email || '';
                const name = helpers.state.ancestors[0].fullname || '';
                if (value.toLowerCase().includes(email.toLowerCase())) {
                    return helpers.error('any.custom', { message: 'Password must not be similar to the email address' });
                }
                if (value.toLowerCase().includes(name.split(' ')[0].toLowerCase())) {
                    return helpers.error('any.custom', { message: 'Password must not be similar to the first name' });
                }
                return value;
            })
            .required()
            .messages({
                'string.pattern.base': 'Password must be between 8 and 30 characters and include letters, numbers, and special characters (!@#$%^&.*).'
            }),
    });

    // Validate the data
    const { error, fullname, email, password, mobile, shopName } = await schema.validateAsync(data);
    const value = { fullname, email, password, mobile, shopName };
    // Handle validation result
    if (error) {
        return { success: false, message: error.details[0].message };
    } else {
        return { success: true, value: value };
    }
};

export default validateModeratorData;

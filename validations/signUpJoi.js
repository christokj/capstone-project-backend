import Joi from "joi";

// Validation function using Joi with custom logic 
export const validateUserData = async (data) => {
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
            .required()
            .messages({
                'string.empty': 'Fullname is required.',
                'string.pattern.base': 'Fullname must contain only letters and spaces.',
                'any.custom': '{{#message}}',
                'any.required': 'Fullname is required.',
            }),

        mobile: Joi.string()
            .pattern(/^\d{10}$/)
            .required()
            .messages({
                'string.empty': 'Mobile number is required.',
                'string.pattern.base': 'Mobile number must be a 10-digit number.',
                'any.required': 'Mobile number is required.',
            }),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .lowercase()
            .pattern(/(\<|^)[\w\d._%+-]+@(?:[\w\d-]+\.)+(\w{2,})(\>|$)/i)
            .required()
            .messages({
                'string.empty': 'Email is required.',
                'string.pattern.base': 'Please enter a valid email.',
                'string.email': 'Please enter a valid email address.',
                'any.required': 'Email is required.',
            }),

        password: Joi.string()
            .min(8)
            .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>~`[\]\\;'/+_=-])[a-zA-Z\d!@#$%^&*(),.?":{}|<>~`[\]\\;'/+_=-]{8,}$/))
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
                'string.pattern.base': 'Password must be between 8 and 100 characters and include letters, numbers, and special characters (!@#$%^&.*).',
                'any.custom': '{{#message}}',
                'any.required': 'Password is required.',
            }),

        address: Joi.object({
            street: Joi.string().trim().required(),
            city: Joi.string().trim().required(),
            state: Joi.string().trim().required(),
            zipCode: Joi.string().trim().required(),
            country: Joi.string().trim().required(),
        }).required().messages({
            'object.base': 'Address is required.',
            'any.required': 'Address fields are required.',
        }),
    });

    // Validate the data
    try {
        const value = await schema.validateAsync(data, { abortEarly: false });
        return { success: true, value };
    } catch (error) {
        // Extract and format error messages
        const errorMessage = error.details.map(err => err.message).join(', ');
        return { success: false, message: errorMessage };
    }
};

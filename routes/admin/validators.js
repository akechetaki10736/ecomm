const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireTitle: 
        check('title')
            .trim()
            .isLength({ min: 5, max: 40 })
            .withMessage('Must be between 5 and 40 characters'),

    requirePrice: 
        check('price')
            .trim()
            .toInt()
            .isInt({ min: 1,  allow_leading_zeroes: false, gt: 0 })
            .withMessage('Must be a number greater than 1'),
    
    requireEmail: 
        check('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .custom(async (email) => {
                const existingUser = await usersRepo.getOneBy({ email });
                if (existingUser) {
                    throw new Error('Email is in use');
                }
            }),

    requirePassword:
        check('password').trim().isLength({ min: 4, max: 20 }).withMessage('Must be between 4 and 20 characters'),

    requirePasswordConfirmation:
        check('passwordConfirmation')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Must be between 4 and 20 characters')
            .custom((passwordConfirmation, { req }) => {
                if (passwordConfirmation !== req.body.password) {
                    throw new Error('Passwords must be match');
                }

                //if the validator function is not an async function
                //must return true at the end to indicate the success of this synchronous custom validator
                //or else it will return undefined and make the check fail.
                return true;
            }),

    requireEmailExist:
        check('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage('Must provide a valid email')
            .custom(async (email) => {
                const user = await usersRepo.getOneBy({ email });
                if (!user) {
                    throw new Error('Email is not found');
                }
            }),
    
    requireValidPasswordForUser:
        check('password')
            .trim()
            .custom(async (password, { req }) => {
                const user = await usersRepo.getOneBy({ email: req.body.email });
                if (!user) {
                    throw new Error('Invalid password');
                }

                const validPassword = await usersRepo.comparePasswords(user.password, password);

                if (!validPassword) {
                    throw new Error('Invalid password');
                }
            })
}




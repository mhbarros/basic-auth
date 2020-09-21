import {body} from 'express-validator';

export const registerUserValidator = [
    body('name').notEmpty().trim().isString().isLength({max: 60}),
    body('username').notEmpty().trim().isString().isLength({max: 60}),
    body('email', 'E-mail inválido').notEmpty().trim().isString().isEmail().isLength({max: 80}),
    body('password').notEmpty().isString(),
    body('passwordConfirm', 'Confirmação de senha inválida').notEmpty().isString().custom((value, {req}) => value === req.body.password)
];

export const updateUserValidator = [
    body('name', 'Nome inválido').notEmpty().trim().isString().isLength({max: 60}),
    body('username', 'Nome de usuário inválido').notEmpty().trim().isString().isLength({max: 60}),
    body('email', 'E-mail inválido').notEmpty().trim().isString().isEmail().isLength({max: 80}),
    body('gender', 'Sexo inválido').trim().isString().isIn(['M', 'F', '']).isLength({max: 1})
]
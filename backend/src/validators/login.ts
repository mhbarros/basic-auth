import {body} from 'express-validator';

export const userLoginValidator = [
    body('email').notEmpty().isString().isEmail().isLength({max: 80}),
    body('password').notEmpty().isString()
]

export const userForgotPasswordValidator = [
    body('email').notEmpty().isString().isEmail().isLength({max: 80}),
]

export const getRecoverByUuid = [
    body('uuid').notEmpty().isString()
]
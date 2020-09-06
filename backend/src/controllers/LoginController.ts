import {Request, Response} from "express";
import {validationResult} from 'express-validator';

import jwt from 'jsonwebtoken';

import db from '../db/db';

import {checkPassword} from '../helpers/crypt';
import {initUserSession, validateUserSession} from '../helpers/auth';
import validate = WebAssembly.validate;

interface User {
    id: number,
    name: string,
    username: string,
    password?: string,
    email: string,
    gender: string
}

export default class LoginController{
    async getLogin(req: Request, res: Response){
        if(!req.cookies.stok){
            return res.json({ok: false});
        }

        const token = req.cookies.stok;

        const isValid = validateUserSession(token);
        if(!isValid){
            return res.json({ok: false});
        }

        return res.json({ok: true});
    }
    async login(req: Request, res: Response){


        const validation = validationResult(req);
        if(!validation.isEmpty()){
            return res.status(400).json({ok: false, errors: validation.array()});
        }

        let {email, password} = req.body;

        let data = await db<User>('users').select().where({email});

        if(!data || data.length !== 1){
            return res.status(400).json({ok: false, errors: [{message: 'Usuário não encontrado'}]});
        }

        const user = data[0];

        if(!user.password) return;

        let checkPass = await checkPassword(password, user.password);
        if(!checkPass){
            return res.status(400).json({ok: false, errors: [{message: 'Senha inválida'}]});
        }

        delete user.password;

        const jwtSecret = process.env.JWT_SECRET;
        if(!jwtSecret){
            return res.status(500).json({ok: false, errors: [{message: 'Ocorreu um erro ao concluir o login.'}]});
        }

        const token = initUserSession(user.id, user.name, user.username);

        return res.json({ok: true, token});
    }
}
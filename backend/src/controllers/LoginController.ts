import {Request, Response} from "express";
import {validationResult} from 'express-validator';

import db from '../db/db';

import {checkPassword} from '../helpers/crypt';
import {initUserSession} from '../helpers/session';

interface User {
    id: number,
    name: string,
    username: string,
    password: string,
    email: string,
    gender: string
}

export default class LoginController{
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

        let checkPass = await checkPassword(password, user.password);
        if(!checkPass){
            return res.status(400).json({ok: false, errors: [{message: 'Senha inválida'}]});
        }

        let session = initUserSession(req, user.id, user.name, user.username, user.email);
        if(!session){
            return res.status(400).json({ok: false, errors: [{message: 'Erro ao realizar login'}]});
        }

        return res.json({ok: true});
    }
}
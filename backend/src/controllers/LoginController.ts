import {Request, Response} from "express";
import {validationResult} from 'express-validator';
import {v4 as uuid} from 'uuid';

import db from '../db/db';

import {checkPassword} from '../helpers/crypt';
import {initUserSession, validateUserSession} from '../helpers/auth';

interface User {
    id: number,
    name: string,
    username: string,
    password?: string,
    email: string,
    gender: string,
    uuid: string
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

        const accessToken  = initUserSession(user.id, user.name, user.username);
        const refreshToken = uuid();

        res.cookie('stok', accessToken, {httpOnly: true, maxAge: 1000*60*60*3, secure: false});
        res.cookie('rtok', refreshToken, {httpOnly: true, maxAge: 1000*60*60*24*365*10, secure: false});
        res.cookie('uuid', user.uuid, {httpOnly: true, maxAge: 1000*60*60*24*365*10, secure: false});

        await db('users_tokens').insert({
            accessToken, refreshToken, uuid: user.uuid
        });

        return res.json({ok: true, accessToken, data: user});
    }
}
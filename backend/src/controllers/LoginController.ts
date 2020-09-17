import {Request, Response} from "express";
import {validationResult} from 'express-validator';
import {v4 as uuid} from 'uuid';

import db from '../db/db';

import {checkPassword} from '../helpers/crypt';
import {initUserSession, setAuthCookie} from '../helpers/auth';

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
        if(typeof accessToken !== 'string'){
            return res.status(400).json({ok: false, erros:[{message: 'Houve um erro ao iniciar sessão.'}]});
        }

        const refreshToken = uuid();

        setAuthCookie(res, accessToken, refreshToken, user.uuid);

        try{
            await db('users_tokens').insert({
                accessToken, refreshToken, uuid: user.uuid
            });
        }catch (e){
            return res.status(400).json({ok: false, errors: [{message: 'Não foi possível iniciar sessão. Por favor, tente novamente.'}]});
        }

        return res.json({ok: true, accessToken, data: user});
    }

    async logout(req: Request, res: Response){
        const {rtok, uuid} = req.cookies;
        res.clearCookie('stok');
        res.clearCookie('rtok');
        res.clearCookie('uuid');

        const response = await db('users_tokens').del().where({uuid, refreshToken: rtok});
        console.log(response);

        res.json({ok: true});
    }
}
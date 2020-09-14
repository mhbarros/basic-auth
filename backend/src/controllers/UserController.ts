import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import {hashPassword} from '../helpers/crypt';
import {v4 as generateUuid} from 'uuid';

import db from '../db/db';
import {initUserSession} from "../helpers/auth";

export default class UserController{
    async get(req: Request, res: Response){
        return res.json({ok: true});
    }
    async create(req: Request, res: Response){
        const validation = validationResult(req);
        if(!validation.isEmpty()){
            return res.status(400).json({ok: false, errors: validation.array()});
        }

        let {name, username, email, password} = req.body;

        password = await hashPassword(password);
        if(!password){
            return res.status(400)
                .json({ok: false, errors: [
                    {message: 'Houve um erro ao realizar cadastro. Por favor, tente novamente'}
                    ]});
        }

        const userUuid = generateUuid();

        try{
            let newUser = await db('users').insert({
                name,
                username,
                email,
                password,
                uuid: userUuid
            });
            if(!newUser){
                return res.status(400).json({ok: false, errors:[{message: 'Houve um erro ao criar usuário. Por favor, tente novamente'}]});
            }

            console.log('Id registrado: ', newUser[0]);

            const accessToken  = initUserSession(newUser[0], name, username);
            const refreshToken = generateUuid();

            res.cookie('stok', accessToken, {httpOnly: true, maxAge: 1000*60*60*3, secure: false});
            res.cookie('rtok', refreshToken, {httpOnly: true, maxAge: 1000*60*60*24*365*10, secure: false});
            res.cookie('uuid', userUuid, {httpOnly: true, maxAge: 1000*60*60*24*365*10, secure: false});

            await db('users_tokens').insert({
                accessToken, refreshToken, uuid: userUuid
            })

            return res.json({ok: true, data: {
                name,
                username,
                email,
                uuid: userUuid
            }});

        }catch (e){
            if(e.code === 'ER_DUP_ENTRY'){
                return res.status(400).json({ok: false, errors: [{message: 'Usuário já cadastrado'}]});
            }
        }
    }
}
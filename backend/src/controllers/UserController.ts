import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import {hashPassword} from '../helpers/crypt';
import {v4 as generateUuid} from 'uuid';

import UserInterface from '../interfaces/User';
import JWTInterface from '../interfaces/JWT';

import jwt from 'jsonwebtoken';

import db from '../db/db';
import {initUserSession} from "../helpers/auth";

export default class UserController{
    async get(req: Request, res: Response){
        const {stok, uuid} = req.cookies;
        if(!stok){
            return res.status(401).json({ok: false});
        }

        let currentUser = jwt.decode(stok) as JWTInterface;
        if(!currentUser){
            return res.status(401).json({ok: false});
        }

        let user = currentUser.user;

        let response = await db<UserInterface>('users').select('id', 'name', 'username', 'email', 'gender').where({id: user.id, uuid});
        if(response.length === 0){
            return res.status(401).json({ok: false});
        }

        user = response[0];

        return res.json({ok: true, data: user});
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
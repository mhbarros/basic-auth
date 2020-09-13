import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import {hashPassword} from '../helpers/crypt';
import {v4 as generateUuid} from 'uuid';

import db from '../db/db';

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

            let userId = newUser[0];

            if(req.session){
                req.session.currentUser = {
                    id: userId,
                    name,
                    username,
                    email
                };
            }else{
                console.log('deu ruim brabo');
            }

        }catch (e){
            if(e.code === 'ER_DUP_ENTRY'){
                return res.status(400).json({ok: false, errors: [{message: 'Usuário já cadastrado'}]});
            }
        }

        return res.redirect('/dashboard');
    }
}
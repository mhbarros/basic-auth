import {Request, Response} from "express";
import {validationResult} from 'express-validator';
import {v4 as uuid} from 'uuid';

import UserInterface from '../interfaces/User';

import db from '../db/db';

import {checkPassword, hashPassword} from '../helpers/crypt';
import {initUserSession, setAuthCookie} from '../helpers/auth';
import {sendForgotPasswordMail} from '../helpers/mail';



export default class LoginController{

    async login(req: Request, res: Response){

        const validation = validationResult(req);
        if(!validation.isEmpty()){
            return res.status(400).json({ok: false, errors: validation.array()});
        }

        let {email, password} = req.body;

        let data = await db<UserInterface>('users').select().where({email});

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

        const removeToken = await db('users_tokens').del().where({uuid, refreshToken: rtok});
        if(removeToken === 1){
            return res.json({ok: true});
        }

        return res.json({ok: false});

    }

    async forgotPassword(req: Request, res: Response){
        const validation = validationResult(req.body);
        if(!validation.isEmpty()) return res.status(400).json({ok: false, errors: validation.array()});

        const {email} = req.body;
        const response = await sendForgotPasswordMail(email);
        if(!response){
            return res.status(400).json({ok: false});
        }
        res.json({ok: true});
    }

    async getRecoverByUuid(req: Request, res: Response){
        const validation = validationResult(req.params);
        if(!validation.isEmpty()) return res.status(400).json({ok: false, errors: validation.array()});

        const {uuid} = req.params;

        const registeredUuid = await db('users_recover').select().where({uuid});
        if(!registeredUuid || registeredUuid.length !== 1){
            return res.status(400).json({ok: false, errors: [{msg: 'Não foi encontrado pedido para recuperação de senha'}]});
        }

        //todo: verificação de validade

        const recoverRequest = registeredUuid[0];
        if(recoverRequest.status == 0){
            return res.status(400).json({ok: false, errors: [{msg: 'Essa alteração de senha já foi realizada anteriormente.'}]});
        }
        res.json({ok: true});
    }

    async recoverPassword(req: Request, res: Response){

        const {uuid, pass, passConfirm} = req.body;

        if(pass !== passConfirm){
            return res.status(400).json({ok: false, errors: [{msg: 'As senhas não conferem'}]});
        }

        const uuidRecover = await db('users_recover').select().where({uuid});
        if(!uuidRecover || uuidRecover.length !== 1){
            return res.status(400).json({ok: false, errors:[{msg: 'Houve um erro ao processar solicitação. Por favor, tente novamente'}]});
        }

        const {email} = uuidRecover[0];

        const newPassword = await hashPassword(pass);
        if(!newPassword){
            return res.status(400).json({ok: false, errors: [{msg: 'Houve um erro ao alterar a senha. Por favor, tente novamente.'}]});
        }

        const trx = await db.transaction();

        const updatePassword = await db('users').update({password: newPassword}).where({email});
        if(!updatePassword){
            await trx.rollback();
            return res.status(400).json({ok: false, errors: [{msg: 'Houve um erro na atualização da senha. Por favor, tente novamente'}]});
        }

        const updateStatus = await db('users_recover').update({status: 0}).where({uuid});
        if(!updateStatus){
            await trx.rollback();
            return res.status(400).json({ok: false, errors: [{msg: 'Houve um erro na atualização da senha. Por favor, tente novamente'}]});
        }

        await trx.commit();
        res.json({ok: true});
    }
}
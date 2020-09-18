import {Request, Response, NextFunction} from 'express';

import {initUserSession, validateUserSession, setAuthCookie} from '../helpers/auth';

import UserInterface from '../interfaces/User';
import UserTokenInterface from '../interfaces/UserToken';

import db from '../db/db';



export default async (req: Request, res: Response, next: NextFunction) => {
    const accessToken  = req.cookies.stok;
    const refreshToken = req.cookies.rtok;
    const uuid         = req.cookies.uuid;

    if(!refreshToken || !uuid){
        res.statusCode = 401;
        res.end();
        return;
    }

    const isValid = validateUserSession(accessToken);

    if(!isValid){
        const checkUserToken = await db<UserTokenInterface>('users_tokens').select().where({refreshToken, uuid});
        if(!checkUserToken[0]){
            res.statusCode = 401;
            res.end();
            return;
        }


        const currentUser = await db<UserInterface>('users').select().where({uuid});
        if(!currentUser){
            res.statusCode = 401;
            res.end();
            return;
        }

        const user = currentUser[0];
        const newAccessToken = initUserSession(user.id, user.name, user.username);
        if(typeof newAccessToken !== 'string'){
            res.statusCode = 401;
            res.end();
            return;
        }

        if(!newAccessToken){
            res.statusCode = 401;
            res.end();
            return;
        }

        setAuthCookie(res, newAccessToken);

        try{
            await db('users_tokens').update({accessToken: newAccessToken}).where({refreshToken, uuid});
        }catch (e){
            console.error(e);

            res.statusCode = 401;
            res.end();
            return;
        }

    }

    next();
}
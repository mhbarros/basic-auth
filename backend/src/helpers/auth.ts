import jwt from 'jsonwebtoken';
import {Response} from "express";

import {v4 as uuid} from 'uuid';

import db from '../db/db';

const jwtExpireTime = 60 * 5;
const jwtExpireTimeInMiliseconds = jwtExpireTime * 1000;

export function initUserSession(id: number, name: string, username: string): string|boolean{
    const secret = process.env.JWT_SECRET;
    if(!secret) return false;

    const payload = {
        user: {
            id,
            name,
            username
        }
    }

    return jwt.sign(payload, secret, {expiresIn: jwtExpireTime});
}

export function validateUserSession(token: string): boolean {
    const secret = process.env.JWT_SECRET;
    if(!secret) return false;

    try{
        const verify = jwt.verify(token, secret);
        if(typeof verify === 'object'){
            return true;
        }
    }catch (e){
        return false;
    }

    return false;
}

export function setAuthCookie(res: Response, accessToken: string, refreshToken?: string|undefined, uuid?: string|undefined): void{
    res.cookie('stok', accessToken, {httpOnly: true, maxAge: jwtExpireTimeInMiliseconds, secure: false});

    if(typeof refreshToken === 'string'){
        res.cookie('rtok', refreshToken, {httpOnly: true, maxAge: 1000*60*60*24*365*10, secure: false});
    }

    if(typeof uuid === 'string'){
        res.cookie('uuid', uuid, {httpOnly: true, maxAge: 1000*60*60*24*365*10, secure: false});
    }

}

export async function generateForgotPasswordLink(mail: string): Promise<string|boolean>{
    const key = uuid();
    let date = new Date();

    date.setMinutes(date.getMinutes() + 30);
    const dateString = date.toISOString();

    const validUntil = dateString.replace('T', ' ').slice(0, dateString.indexOf('.'));

    const response = await db('users_recover').insert({
        email: mail,
        uuid: key,
        valid_until: validUntil
    });

    if(!response) return false;

    return `http://localhost:3000/recover/${key}`;
}
import {Request} from 'express';

export function initUserSession(req: Request, id: number, name: string, username: string, email: string){
    if(!req.session) return false;

    req.session.currentUser = {
        id,
        name,
        username,
        email
    }

    return true;
}
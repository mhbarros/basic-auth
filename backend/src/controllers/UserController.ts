import {Request, Response} from 'express';

export default class UserController{
    async create(req: Request, res: Response){

        return res.json({ok: true});
    }
}
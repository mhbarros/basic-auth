import {Request, Response} from 'express';

export default class UserController{
    async create(req: Request, res: Response){
        if(!req.session){
            return res.json({ok: false});
        }

        if(req.session.test){
            req.session.test++;
        }else{
            req.session.test = 1;
        }

        console.log(req.session.test);

        return res.json({ok: true});
    }
}
import express, {Response} from 'express';

import {registerUserValidator, updateUserValidator} from './validators/user';
import {userLoginValidator, userForgotPasswordValidator, getRecoverByUuid} from './validators/login';

import UserController from './controllers/UserController';
import LoginController from "./controllers/LoginController";

import userAuth from './middleware/auth';

const routes          = express.Router();
const userController  = new UserController();
const loginController = new LoginController();

routes.get('/login', userAuth, (_, res: Response) => {res.json({ok: true});});
routes.get('/user', userAuth, userController.get);
routes.get('/recover/:uuid', getRecoverByUuid, loginController.getRecoverByUuid);

routes.post('/user', registerUserValidator, userController.create);
routes.post('/login', userLoginValidator, loginController.login);
routes.post('/login/forgot', userForgotPasswordValidator, loginController.forgotPassword);
routes.post('/logout', loginController.logout);
routes.post('/recover', loginController.recoverPassword);

routes.patch('/user', updateUserValidator, userController.update)

export default routes;
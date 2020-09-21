import express, {Response} from 'express';

import {registerUserValidator, updateUserValidator} from './validators/user';
import {userLoginValidator, userForgotPasswordValidator} from './validators/login';

import UserController from './controllers/UserController';
import LoginController from "./controllers/LoginController";

import userAuth from './middleware/auth';

const routes          = express.Router();
const userController  = new UserController();
const loginController = new LoginController();

routes.get('/login', userAuth, (_, res: Response) => {res.json({ok: true});});
routes.get('/user', userAuth, userController.get);

routes.post('/user', registerUserValidator, userController.create);
routes.patch('/user', updateUserValidator, userController.update)
routes.post('/login', userLoginValidator, loginController.login);
routes.post('/login/forgot', userForgotPasswordValidator, loginController.forgotPassword);
routes.post('/logout', loginController.logout);

export default routes;
import express from 'express';

import {registerUser} from './validators/user';

import UserController from './controllers/UserController';

const routes         = express.Router();
const userController = new UserController();

routes.post('/user', registerUser, userController.create)

export default routes;
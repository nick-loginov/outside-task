import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`/login`, validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);
    this.router.post(`/logout`, this.authController.logOut);
  }
}

export default AuthRoute;
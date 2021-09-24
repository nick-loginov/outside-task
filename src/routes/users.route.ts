import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';
import UsersTagsRoute from '@routes/users.tags.route';

class UsersRoute implements Routes {
  public path = '/user';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.router.use(authMiddleware);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/`, this.usersController.getUser);
    this.router.put(`/`, validationMiddleware(CreateUserDto, 'body'), this.usersController.updateUser);
    this.router.delete(`/`, this.usersController.deleteUser);

    const userTagsRoute = new UsersTagsRoute();
    this.router.use(userTagsRoute.path, userTagsRoute.router);
  }
}

export default UsersRoute;

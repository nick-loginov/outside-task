import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';
import TagsController from '@controllers/tags.controller';
import UsersTagsController from '@controllers/users.tags.controller';
import { GetTagDto, GetTagsPaginateDto } from '@dtos/tags.dto';
import { AddTagsDto } from '@dtos/users.tags.dto';

class UsersTagsRoute implements Routes {
  public path = '/tag';
  public router = Router();
  public userTagsController = new UsersTagsController();
  public tagsController = TagsController.instance;

  constructor() {
    this.router.use(authMiddleware);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', validationMiddleware(GetTagsPaginateDto, 'query'), this.userTagsController.getTagsPaginate);
    this.router.get(`/my`, this.userTagsController.getMyTags);
    this.router.delete(`/delete/:id`, validationMiddleware(GetTagDto, 'params'), this.tagsController.deleteTag);
    this.router.post(`/`, validationMiddleware(AddTagsDto, 'body'), this.userTagsController.addTags);
  }
}

export default UsersTagsRoute;

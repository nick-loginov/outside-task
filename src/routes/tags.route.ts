import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';
import TagsController from '@controllers/tags.controller';
import { CreateTagDto, GetTagDto, GetTagsPaginateDto, UpdateTagDto } from '@dtos/tags.dto';

class TagsRoute implements Routes {
  public path = '/tag';
  public router = Router();
  public tagsController = TagsController.instance;

  constructor() {
    this.router.use(authMiddleware);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/:id([0-9]+)', validationMiddleware(GetTagDto, 'params'), this.tagsController.findById);
    this.router.delete('/:id([0-9]+)', validationMiddleware(GetTagDto, 'params'), this.tagsController.deleteTag);
    this.router.get('/', validationMiddleware(GetTagsPaginateDto, 'query'), this.tagsController.getTagsPaginate);
    this.router.post('/', validationMiddleware(CreateTagDto, 'body'), this.tagsController.createTag);
    this.router.put(
      '/:id([0-9]+)',
      validationMiddleware(UpdateTagDto, 'params'),
      validationMiddleware(CreateTagDto, 'body'),
      this.tagsController.updateTag,
    );
  }
}

export default TagsRoute;

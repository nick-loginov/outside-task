import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import { GetTagsPaginateDto } from '@dtos/tags.dto';
import * as core from 'express-serve-static-core';
import UsersTagsService from '@services/users.tags.service';
import { AddTagsDto } from '@dtos/users.tags.dto';
import TagsService from '@services/tags.service';

const DEFAULT_LENGTH_VALUE = 100;

class UsersTagsController {
  userTagsService = UsersTagsService.instance;
  tagsService = TagsService.instance;

  public addTags = async (req: RequestWithUser<core.ParamsDictionary, any, AddTagsDto>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body;
      const updateUserData = await this.userTagsService.addTags(req.user.uid, dto);
      res.status(200).json({ data: updateUserData });
    } catch (error) {
      next(error);
    }
  };

  public getTagsPaginate = async (
    req: RequestWithUser<core.ParamsDictionary, any, any, core.Query & GetTagsPaginateDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.query;
      const options = {
        ...dto,
        length: dto.length || DEFAULT_LENGTH_VALUE,
      };
      const [tagsWithUser, quantity] = await this.userTagsService.get(req.user.uid, options);
      res.status(200).json({
        data: tagsWithUser,
        meta: {
          length: options.length,
          offset: options.offset,
          quantity,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getMyTags = async (
    req: RequestWithUser<core.ParamsDictionary, any, any, core.Query & GetTagsPaginateDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tagsCreatedByUser = await this.tagsService.getTagsCreatedByUser(req.user.uid);
      res.status(200).json({
        data: tagsCreatedByUser,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersTagsController;

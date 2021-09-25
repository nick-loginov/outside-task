import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import { CreateTagDto, GetTagDto, GetTagsPaginateDto, UpdateTagDto } from '@dtos/tags.dto';
import * as core from 'express-serve-static-core';
import TagsService from '@services/tags.service';
import UsersService from '@services/users.service';

const DEFAULT_LENGTH_VALUE = 100;

class TagsController {
  tagsService = TagsService.instance;
  private static _instance: TagsController;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static get instance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
  public findById = async (req: RequestWithUser<core.ParamsDictionary & GetTagDto>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.params;
      const updateUserData = await this.tagsService.findById(dto.id);
      res.status(200).json({ data: updateUserData });
    } catch (error) {
      next(error);
    }
  };

  public deleteTag = async (req: RequestWithUser<core.ParamsDictionary & GetTagDto>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.params;
      const updateUserData = await this.tagsService.deleteTag(req.user.uid, dto.id);
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
      const [tagsWithUser, quantity] = await this.tagsService.getPaginate(options);
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

  public updateTag = async (
    req: RequestWithUser<core.ParamsDictionary & UpdateTagDto, any, CreateTagDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body;
      const tagId = req.params.id;
      const tag = await this.tagsService.putTag(req.user.uid, tagId, dto);
      res.status(200).json({
        data: tag,
      });
    } catch (error) {
      next(error);
    }
  };

  public createTag = async (req: RequestWithUser<core.ParamsDictionary, any, CreateTagDto>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body;
      const tag = await this.tagsService.createTag(req.user.uid, dto);
      res.status(200).json({
        data: tag,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TagsController;

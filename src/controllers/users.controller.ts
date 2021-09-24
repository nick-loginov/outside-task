import { NextFunction, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import UsersService from '@services/users.service';
import { RequestWithUser } from '@interfaces/auth.interface';

class UsersController {
  userService = UsersService.instance;

  public getUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updateUserData = await this.userService.getUser(req.user.uid);
      res.status(200).json({ data: updateUserData });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const updateUserData = await this.userService.updateUser(req.user.uid, userData);

      res.status(200).json({ data: updateUserData });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.deleteUser(req.user.uid);

      res.status(200).json({ data: {} });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;

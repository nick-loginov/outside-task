import bcrypt from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { SafeUser, User, UserWithTags } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { UsersModel } from '@/models/users.model';

class UsersService {
  private static _instance: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static get instance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  public mapUserToSafe<T extends User>(user: T): Exclude<T, Exclude<User, SafeUser>> {
    const safe: T = JSON.parse(JSON.stringify(user));
    delete safe.uid;
    delete safe.password;
    return safe;
  }

  public async getUser(uid: string): Promise<UserWithTags> {
    const findUser = await UsersModel.findByIdWithTags(uid);
    if (isEmpty(findUser)) throw new HttpException(409, "You're not user");

    return this.mapUserToSafe(findUser);
  }

  public async updateUser(uid: string, userData: CreateUserDto): Promise<SafeUser> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UsersModel.findById(uid);
    if (isEmpty(findUser)) throw new HttpException(409, "You're not user");

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const updateUserData = await UsersModel.update(uid, { ...userData, password: hashedPassword });

    return this.mapUserToSafe(updateUserData);
  }

  public async deleteUser(uid: string): Promise<void> {
    const findUser: User = await UsersModel.findById(uid);
    if (isEmpty(findUser)) throw new HttpException(409, "You're not user");

    await UsersModel.delete(uid);
    return;
  }
}

export default UsersService;

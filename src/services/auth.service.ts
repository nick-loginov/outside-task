import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { isEmpty } from '@utils/util';
import { v4 as uuidv4 } from 'uuid';
import { UsersModel } from '@/models/users.model';
import { User } from '@interfaces/users.interface';

class AuthService {
  private static _instance: AuthService;

  constructor() {
    if (isEmpty(AuthService._instance)) {
      AuthService._instance = this;
    }
    return AuthService._instance;
  }

  public async signup(userData: CreateUserDto): Promise<Partial<CreateUserDto>> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    let findUser = await UsersModel.findByEmail(userData.email);
    if (!isEmpty(findUser)) throw new HttpException(409, `Your email ${userData.email} already exists`);

    findUser = await UsersModel.findByNickname(userData.nickname);
    if (!isEmpty(findUser)) throw new HttpException(409, `Your nickname ${userData.nickname} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const uuid = uuidv4();
    const user: User = { ...userData, uid: uuid, password: hashedPassword };
    try {
      await UsersModel.put(user);
    } catch (e) {
      throw new HttpException(409, 'This user already registered.');
    }
    delete userData.password;
    return userData;
  }

  public async login(userData: LoginUserDto): Promise<{ token: string; expire: number }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UsersModel.findByEmail(userData.email);
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUser);

    return { token: tokenData.token, expire: tokenData.expires };
  }

  public async logout(user: User): Promise<User> {
    const findUser: User = await UsersModel.findById(user.uid);
    if (isEmpty(findUser)) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { uid: user.uid };
    const secretKey: string = config.get('secretKey');
    const expires: number = 30 * 60;

    return { expires, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn: expires }) };
  }
}

export default AuthService;

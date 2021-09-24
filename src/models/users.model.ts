import { DatabaseService } from '@services/database.service';
import { User, UserWithTags } from '@interfaces/users.interface';
import { CreateUserDto } from '@dtos/users.dto';
import { TagWithoutCreator } from '@interfaces/tags.interface';
import { TagsModel } from '@models/tags.model';
import { UserTagModel } from '@models/user-tag.model';

export interface UserDatabase {
  user_uid: string;
  user_nickname: string;
  user_password: string;
  user_email: string;
}

export class UsersModel {
  public static getUserFromRow(row: UserDatabase): User {
    return {
      uid: row.user_uid,
      email: row.user_email,
      password: row.user_password,
      nickname: row.user_nickname,
    };
  }

  public static async put(user: User): Promise<User> {
    const queryResult = await DatabaseService.query('INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING *;', [
      user.uid,
      user.email,
      user.password,
      user.nickname,
    ]);
    return UsersModel.getUserFromRow(queryResult.rows[0]);
  }

  public static async delete(uid: string): Promise<void> {
    try {
      await DatabaseService.query('DELETE FROM users WHERE user_uid = $1', [uid]);
    } catch (e) {
      throw e;
    }
    return;
  }

  public static async update(uid: string, dto: CreateUserDto): Promise<User> {
    const queryResult = await DatabaseService.query(
      'UPDATE users SET user_password=$1, user_email = $2, user_nickname=$3 WHERE user_uid = $4 RETURNING *',
      [dto.password, dto.email, dto.nickname, uid],
    );
    return UsersModel.getUserFromRow(queryResult.rows[0]);
  }

  public static async findByEmail(email: string): Promise<User | null> {
    const queryResult = await DatabaseService.query('SELECT * FROM users WHERE user_email = $1', [email]);
    if (queryResult.rowCount === 0) {
      return null;
    }
    return UsersModel.getUserFromRow(queryResult.rows[0]);
  }

  public static async findById(uid: string): Promise<User | null> {
    const queryResult = await DatabaseService.query('SELECT * FROM users WHERE user_uid = $1', [uid]);

    if (queryResult.rowCount === 0) {
      return null;
    }
    return UsersModel.getUserFromRow(queryResult.rows[0]);
  }

  public static async findByIdWithTags(uid: string): Promise<UserWithTags | null> {
    const queryResult = await DatabaseService.query(
      'SELECT * FROM users LEFT JOIN (user_tag JOIN tags ON tag_id = ut_tag_id) ON user_uid = ut_user_uid WHERE user_uid = $1',
      [uid],
    );
    if (queryResult.rowCount === 0) {
      return null;
    }
    const { rows } = queryResult;
    const tags: TagWithoutCreator[] = rows
      .filter(row => row.tag_id !== null)
      .map(row => ({
        id: row.tag_id,
        name: row.tag_name,
        sortOrder: row.tag_sort_order,
      }));
    return {
      ...UsersModel.getUserFromRow(rows[0]),
      tags,
    };
  }

  public static async findByNickname(nickname: string): Promise<User | null> {
    const queryResult = await DatabaseService.query('SELECT * FROM users WHERE user_nickname = $1', [nickname]);
    if (queryResult.rowCount === 0) {
      return null;
    }
    return queryResult.rows[0];
  }
}

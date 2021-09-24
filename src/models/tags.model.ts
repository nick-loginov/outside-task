import { DatabaseService } from '@services/database.service';
import { Tag, TagWithUser } from '@interfaces/tags.interface';
import { UserDatabase, UsersModel } from '@models/users.model';
import { logger } from '@utils/logger';
import { CreateTagDto } from '@dtos/tags.dto';

export interface TagDatabase {
  tag_id: number;
  tag_name: string;
  tag_sort_order: number;
  tag_creator: string;
}

export class TagsModel {
  public static getTagFromRow(row: TagDatabase) {
    const tag = {
      id: row.tag_id,
      name: row.tag_name,
      sortOrder: row.tag_sort_order,
      creator: row.tag_creator,
    };
    return tag;
  }

  public static getTagWithUserFromRow(row: TagDatabase & UserDatabase): TagWithUser {
    const tag = TagsModel.getTagFromRow(row);
    const user = row.user_uid === null ? null : UsersModel.getUserFromRow(row);
    return {
      ...tag,
      creator: user,
    };
  }

  public static async create(creator: string, dto: CreateTagDto): Promise<Tag | null> {
    try {
      const queryResult = await DatabaseService.query('INSERT INTO tags (tag_name, tag_sort_order, tag_creator) VALUES ($1, $2, $3) RETURNING *', [
        dto.name,
        dto.sortOrder,
        creator,
      ]);
      if (queryResult.rowCount == 0) {
        return null;
      }
      return this.getTagFromRow(queryResult.rows[0]);
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  public static async put(tag: Tag): Promise<Tag> {
    try {
      const queryResult = await DatabaseService.query(
        'UPDATE tags SET tag_name=$1, tag_sort_order = $2 WHERE tag_id = $3 AND tag_creator = $4 RETURNING *',
        [tag.name, tag.sortOrder, tag.id, tag.creator],
      );
      if (queryResult.rowCount == 0) {
        return null;
      }

      return TagsModel.getTagFromRow(queryResult.rows[0]);
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  public static async delete(uid: string, id: number): Promise<Tag | null> {
    const deleteResult = await DatabaseService.query('DELETE FROM tags WHERE tag_id = $1 AND tag_creator = $2 RETURNING *', [id, uid]);
    if (deleteResult.rowCount == 0) {
      return null;
    }
    return this.getTagFromRow(deleteResult.rows[0]);
  }

  public static async deleteAllByCreator(uid: string): Promise<void> {
    await DatabaseService.query('DELETE FROM tags WHERE tag_creator = $1', [uid]);
  }

  public static async getAllByCreator(uid: string): Promise<Tag[]> {
    const queryResult = await DatabaseService.query('SELECT * FROM tags WHERE tag_creator = $1', [uid]);
    return queryResult.rows.map(this.getTagFromRow);
  }

  public static async findById(id: number): Promise<TagWithUser | null> {
    const queryResult = await DatabaseService.query(
      'SELECT * FROM (SELECT * FROM tags WHERE tag_id = $1) as tags JOIN users ON tag_creator = user_uid',
      [id],
    );

    if (queryResult.rowCount === 0) {
      return null;
    }

    return this.getTagWithUserFromRow(queryResult.rows[0]);
  }

  public static async getByUserPaginate(uid, orderColumns: (keyof TagDatabase)[], offset: number, limit: number): Promise<[Tag[], number]> {
    let order = '';
    if (orderColumns.length > 0) {
      order = 'ORDER BY ' + orderColumns.join(', ');
    }
    const query = `SELECT * FROM user_tag JOIN tags ON ut_tag_id = tag_id WHERE ut_user_uid = $1 ${order} offset ${offset} LIMIT ${limit}`;
    let queryResult = await DatabaseService.query(query, [uid]);

    const tagsWithUser = queryResult.rows.map(this.getTagFromRow);
    queryResult = await DatabaseService.query('SELECT COUNT(*) FROM tags');
    const quantity = parseInt(queryResult.rows[0].count);

    return [tagsWithUser, quantity];
  }
}

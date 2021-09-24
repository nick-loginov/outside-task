import { DatabaseService } from '@services/database.service';

export class UserTagModel {
  public static async addTagsToUser(uid: string, tagIds: number[]): Promise<{} | null> {
    try {
      DatabaseService.query('BEGIN');
      for (const tagId of tagIds) {
        await DatabaseService.query('INSERT INTO user_tag (ut_user_uid, ut_tag_id) VALUES ($1, $2)', [uid, tagId]);
      }
      DatabaseService.query('COMMIT');
      return {};
    } catch (e) {
      await DatabaseService.query('ROLLBACK');
      return null;
    }
  }
}

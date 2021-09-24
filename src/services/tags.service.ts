import { CreateTagDto, GetTagsPaginateDto } from '@dtos/tags.dto';
import { TagDatabase, TagsModel } from '@models/tags.model';
import { GetTagsPaginateOptions, SafeTag, SafeTagWithUser, Tag, TagWithUser } from '@interfaces/tags.interface';
import UsersService from '@services/users.service';
import { isEmpty } from '@utils/util';
import { HttpException } from '@exceptions/HttpException';
import { type } from 'os';
import { User } from '@interfaces/users.interface';

class TagsService {
  private static _instance: TagsService;
  private usersService = UsersService.instance;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static get instance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  public mapTagToSafe(tag: TagWithUser | Tag | null): SafeTagWithUser | SafeTag {
    if (tag === null) {
      return null;
    }
    const safe: TagWithUser | Tag = JSON.parse(JSON.stringify(tag));
    if (typeof safe.creator === 'string') {
      delete safe.creator;
    } else {
      safe.creator = this.usersService.mapUserToSafe(tag.creator as User);
    }
    return safe;
  }

  public async findById(id: number) {
    return this.mapTagToSafe(await TagsModel.findById(id));
  }

  public async deleteTag(uid: string, tagId: number) {
    const queryResult = await TagsModel.delete(uid, tagId);
    if (isEmpty(queryResult)) {
      throw new HttpException(400, 'You cannot delete this tag');
    }
    return queryResult;
  }

  public async createTag(uid: string, dto: CreateTagDto) {
    const queryResult = await TagsModel.create(uid, dto);
    if (isEmpty(queryResult)) {
      throw new HttpException(400, 'Failed to create tag');
    }
    return this.mapTagToSafe(queryResult);
  }

  public async getTagsCreatedByUser(uid: string): Promise<SafeTag[]> {
    const tags = await TagsModel.getAllByCreator(uid);
    return tags.map(this.mapTagToSafe);
  }

  public async getByUserPaginate(uid: string, options: GetTagsPaginateDto) {
    const sortColumns: (keyof TagDatabase)[] = [];
    if (options.sortNames !== undefined) {
      sortColumns.push('tag_name');
    }
    if (options.sortOrder !== undefined) {
      sortColumns.push('tag_sort_order');
    }
    const [unsafeTags, quantity] = await TagsModel.getByUserPaginate(uid, sortColumns, options.offset, options.length);
    return [unsafeTags.map(this.mapTagToSafe.bind(this)), quantity];
  }

  public async putTag(uid: string, tagId: number, dto: CreateTagDto) {
    const queryResult = await TagsModel.put({
      id: tagId,
      creator: uid,
      ...dto,
    });
    if (isEmpty(queryResult)) {
      throw new HttpException(400, 'You cannot edit this tag');
    }
    return this.mapTagToSafe(queryResult);
  }
}

export default TagsService;

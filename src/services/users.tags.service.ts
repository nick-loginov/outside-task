import { HttpException } from '@exceptions/HttpException';
import { AddTagsDto } from '@dtos/users.tags.dto';
import { UserTagModel } from '@models/user-tag.model';
import { GetTagsPaginateDto } from '@dtos/tags.dto';
import { TagDatabase, TagsModel } from '@models/tags.model';
import TagsService from '@services/tags.service';

class UsersTagsService {
  private static _instance: UsersTagsService;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static get instance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  private tagService = TagsService.instance;

  public async get(uid: string, options: GetTagsPaginateDto) {
    const sortColumns: (keyof TagDatabase)[] = [];
    if (options.sortNames !== undefined) {
      sortColumns.push('tag_name');
    }
    if (options.sortOrder !== undefined) {
      sortColumns.push('tag_sort_order');
    }
    const [unsafeTags, quantity] = await TagsModel.getByUserPaginate(uid, sortColumns, options.offset, options.length);
    return [unsafeTags.map(this.tagService.mapTagToSafe.bind(this.tagService)), quantity];
  }

  public async addTags(uid: string, dto: AddTagsDto): Promise<{}> {
    const addTagsResult = await UserTagModel.addTagsToUser(uid, dto.tags);
    if (addTagsResult == null) throw new HttpException(400, 'Wrong tag ids');

    const [userTags] = await TagsModel.getByUserPaginate(uid, [], 0, 100);
    return userTags.map(this.tagService.mapTagToSafe.bind(this.tagService));
  }
}

export default UsersTagsService;

import { SafeUser, User } from '@interfaces/users.interface';

export interface GetTagsPaginateOptions {
  offset: number;
  length: number;
  sortOrder: boolean;
  sortNames: boolean;
}

export interface Tag {
  id: number;
  name: string;
  sortOrder: number;
  creator: string;
}

export interface TagWithoutCreator {
  id: number;
  name: string;
  sortOrder: number;
}

export interface TagWithUser {
  id: number;
  name: string;
  sortOrder: number;
  creator: User;
}

export interface SafeTag {
  name: string;
  sortOrder: number;
}

export interface SafeTagWithUser {
  id: number;
  name: string;
  sortOrder: number;
  creator: SafeUser;
}

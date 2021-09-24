import { TagWithoutCreator } from '@interfaces/tags.interface';

export interface User {
  uid: string;
  nickname: string;
  email: string;
  password: string;
}

export type UserWithTags = User & {
  tags: TagWithoutCreator[];
};

export interface SafeUser {
  nickname: string;
  email: string;
}

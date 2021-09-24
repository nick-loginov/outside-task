import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class AddTagsDto {
  @IsArray()
  @Type(() => Number)
  tags: number[];
}

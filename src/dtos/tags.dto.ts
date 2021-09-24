import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTagDto {
  @IsString()
  public name: string;

  @IsNumber()
  @Type(() => Number)
  public sortOrder: number;
}

export class UpdateTagDto {
  @IsNumber()
  @Type(() => Number)
  id: number;
}

export class GetTagsPaginateDto {
  @IsNumber()
  @Type(() => Number)
  public offset: number;

  @IsOptional()
  public length: number;

  @IsOptional()
  @IsEmpty()
  public sortOrder;

  @IsOptional()
  @IsEmpty()
  public sortNames;
}

export class GetTagDto {
  @IsNumber()
  id: number;
}

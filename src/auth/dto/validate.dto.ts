import { Type } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class ValidateDto {
  @IsString()
  token: string;
}

export class ValidateParamDto {
  @Type(() => Boolean)
  @IsBoolean()
  show: boolean;
}

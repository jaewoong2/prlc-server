import { IsOptional, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateLinkDto {
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  origin_url: string;

  @IsString()
  custom_url: string;

  @IsOptional()
  user?: User;
}

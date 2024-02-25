import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreateLinkDto } from './create-link.dto';

export class CreateUserLinkDto extends CreateLinkDto {
  @IsString()
  @IsOptional()
  image?: string;

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
  @IsEmail()
  user: string;
}

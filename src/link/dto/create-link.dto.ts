import { IsOptional, IsString } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  origin_url: string;

  @IsString()
  custom_url: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

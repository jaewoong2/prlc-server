import { IsString, IsOptional } from 'class-validator';

export class UpdateLinkDto {
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
  custom_url: string;
}

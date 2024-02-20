import { IsString } from 'class-validator';

export class SearchDto {
  @IsString()
  custom_url: string;
}

import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class FindAllDto {
  @Type(() => Number)
  @Min(1)
  take: number;
}

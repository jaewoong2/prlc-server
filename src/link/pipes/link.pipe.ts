import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class QueryDefaultValueParseIntPipe implements PipeTransform {
  transform(value: { [key: string]: string }) {
    // 값이 undefined이거나 빈 문자열인 경우 기본값 10을 반환
    const transformedValue: { [key: string]: any } = {};

    Object.keys(value).forEach((key) => {
      transformedValue[key] = value[key];
      transformedValue[key] = parseInt(transformedValue[key], 10);
      if (isNaN(transformedValue[key])) {
        // 변환할 수 없는 경우 BadRequestException 예외를 발생
        throw new BadRequestException(
          `Validation failed. "${value}" is not an integer.`,
        );
      }
    });

    return transformedValue;
  }
}

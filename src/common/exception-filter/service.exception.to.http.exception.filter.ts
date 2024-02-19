import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ServiceException } from '../exception/service.exception';
import { Response, Request } from 'express';

// src/common/exception-filter/service.exception.to.http.exception.filter.ts
@Catch(ServiceException)
export class ServiceExceptionToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: ServiceException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = +exception.errorCode.status;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      path: request.url,
    });
  }
}

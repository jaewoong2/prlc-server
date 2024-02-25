import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RouteDispatcherMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && req.body.user) {
      req.url = `/link/${req.body.user}`;
    } else {
      req.url = '/link'; // 요청을 a 메소드로 라우팅
    }

    next();
  }
}

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { User } from 'src/auth/entities/user.entity';
import { RouteDispatcherMiddleware } from './middleware/route-dispatch.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Link, User])],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RouteDispatcherMiddleware)
      .forRoutes({ method: RequestMethod.POST, path: '/link' });
  }
}

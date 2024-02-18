import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsCognitoController } from './aws-cognito.controller';

@Module({
  controllers: [AuthController, AwsCognitoController],
  providers: [AuthService, AwsCognitoService],
})
export class AuthModule {}

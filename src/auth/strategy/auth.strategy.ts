import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { ValidatationErrorException } from 'src/common/exception/service.exception';

export interface UserToken {
  id: number;
  username: string;
  email: string;
  // 토큰이 발급된 시간 (issued at)
  iat: number;
  // 토큰의 만료시간 (expiraton)
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: UserToken) {
    const token = req.headers['authorization'].split(' ')[1];
    const { isValidate, message } = await this.authService.tokenValidate({
      token,
      email: payload.email,
    });

    if (!isValidate) {
      throw ValidatationErrorException(message);
    }

    return { ...payload, token };
  }
}

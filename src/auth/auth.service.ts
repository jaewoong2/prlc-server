import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserToken } from './strategy/auth.strategy';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginEmailDto } from './dto/login-email.dto';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { User } from './entities/user.entity';
import { ConfigType } from '@nestjs/config';
import _authConfig from 'src/config/auth.config';
import _awsConfig from 'src/config/aws.config';

@Injectable()
export class AuthService {
  client: SESClient;
  constructor(
    @Inject(_authConfig.KEY)
    private authConfig: ConfigType<typeof _authConfig>,
    @Inject(_awsConfig.KEY)
    private awsConfig: ConfigType<typeof _awsConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, // auth.module의 JwtModule로부터 공급 받음
  ) {
    this.client = new SESClient({ region: awsConfig.aws.s3.region });
  }

  async tokenValidate({ email, token }: { email: string; token: string }) {
    if (!email) {
      return { isValidate: false, message: 'Email이 정의되지 않았습니다.' };
    }

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return {
        isValidate: false,
        message: '잘못된 Email 정보 입니다',
      };
    }

    if (token !== user.access_token) {
      return {
        isValidate: false,
        message: '잘못된 JWT Token 입니다. 다시 로그인 해주세요',
      };
    }

    return { isValidate: true, message: '올바른 JWT Token 입니다.' };
  }

  async loginByMagiclink(token: string) {
    try {
      const decodedToken = this.jwtService.decode(token);

      if (typeof decodedToken === 'string') throw new UnauthorizedException();

      if (!('email' in decodedToken && 'redirectTo' in decodedToken)) {
        throw new UnauthorizedException('옳지 않은 Token 입니다');
      }

      const { email, redirectTo } = decodedToken;

      const user = await this.userRepository.findOne({ where: { email } });
      const refreshToken = this.jwtService.sign(
        { email },
        {
          expiresIn: this.authConfig.auth.refreshToken.expiresIn, // 리프레시 토큰의 유효 기간
        },
      );

      if (user && user.access_token !== token) {
        throw new UnauthorizedException('만료된 토큰 입니다.');
      }

      const savedUser = await this.userRepository.save({
        id: user?.id ?? null,
        email: email,
        username: email,
        access_token: this.jwtService.sign({ email }),
        refresh_token: refreshToken,
      });

      return {
        redirectTo:
          new URL(redirectTo).href + `?token=${savedUser.access_token}`,
        ...savedUser,
      };
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async sendMagicLink({ email, redirectTo }: LoginEmailDto): Promise<void> {
    const payload = { email, redirectTo };
    const token = this.jwtService.sign(payload);
    const link = `${this.authConfig.auth.redirect}/${token}`;

    const command = new SendEmailCommand({
      Destination: {
        //목적지
        CcAddresses: [],
        ToAddresses: [email], // 받을 사람의 이메일
      },
      Message: {
        Body: {
          // 이메일 본문 내용
          Text: {
            Charset: 'UTF-8',
            Data: `메일이 보내지는지 테스트중입니다.${link}`,
          },
        },
        Subject: {
          // 이메일 제목
          Charset: 'UTF-8',
          Data: '이메일 테스트',
        },
      },
      Source: 'no-reply@prlc.kr', // 보내는 사람의 이메일 - 무조건 Verfied된 identity여야 함
      ReplyToAddresses: [],
    });

    try {
      await this.client.send(command);
      await this.userRepository.update({ email }, { access_token: token });
    } catch (err) {
      console.error({ err });
    }
  }

  async isValidateToken(token: number) {
    const now = new Date().getTime();
    return now <= token;
  }

  async isValidateRefreshToken(payload: UserToken, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (user.refresh_token !== refreshToken) {
      throw new UnauthorizedException('옳지 않은 Refresh Token Value');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async refresh({ exp, iat, ...payload }: UserToken) {
    const token = {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.authConfig.auth.refreshToken.expiresIn, // 리프레시 토큰의 유효 기간
      }),
    };

    await this.userRepository.update(
      { id: payload.id },
      { refresh_token: token.refresh_token, access_token: token.access_token },
    );

    return token;
  }

  async findOneByEmail(
    email: string,
    { notException }: { notException?: boolean } = { notException: true },
  ) {
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });

    if (user && notException) {
      throw new BadRequestException('이미 존재하는 이메일 입니다.');
    }

    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async jwtLogin({ ...payload }: Partial<User>) {
    const token = {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.authConfig.auth.refreshToken.expiresIn, // 리프레시 토큰의 유효 기간
      }),
    };

    await this.userRepository.update(
      { id: payload.id },
      { refresh_token: token.refresh_token, access_token: token.access_token },
    );

    return token;
  }

  async jwtSignin(data: CreateUserDto) {
    await this.findOneByEmail(data.email);

    const user = this.userRepository.create({
      email: data.email,
      username: data.username,
    });

    await this.userRepository.save(user);
    return user;
  }
}

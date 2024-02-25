import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { RefreshAuthGuard } from './guard/refresh.guard';
import { LoginEmailDto } from './dto/login-email.dto';
import { User } from './entities/user.entity';
import { UserToken } from './strategy/auth.strategy';
import { JwtAuthGuard } from './guard/auth.guard';
import { ValidateParamDto } from './dto/validate.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login-email')
  async sendEmail(@Body() { redirectTo, email }: LoginEmailDto) {
    this.authService.sendMagicLink({ redirectTo, email });
    return 'Mail Send';
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validate(
    @Req() req: Request & { user: UserToken & { token: string } },
    @Query() query: ValidateParamDto,
  ) {
    if (!this.authService.tokenValidate({ ...req.user })) {
      return {
        message: `Failuire`,
        data: {
          show: false,
        },
      };
    }

    const { show } = query;

    return {
      message: `Find All ${'a'} Link Successly`,
      data: {
        show: show ?? false,
      },
    };
  }

  @Get('login-email/:token')
  async getToken(
    @Param('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { redirectTo, refresh_token, access_token } =
      await this.authService.loginByMagiclink(token);

    res.header('Authorization', `Bearer ${access_token}`);
    res.cookie('Refresh', `${refresh_token}`);

    return res.redirect(redirectTo);
  }

  @Post('login')
  async login(
    @Req() { user }: { user: User },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.jwtLogin(user);

    res.header('Authorization', `Bearer ${token.access_token}`);
    res.cookie('Refresh', `${token.refresh_token}`);

    return token;
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @Req() { user }: { user: UserToken },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.refresh(user);

    res.header('Authorization', `Bearer ${token.access_token}`);
    res.cookie('Refresh', `${token.refresh_token}`);
    return token;
  }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.jwtSignin(createUserDto);
  }
}

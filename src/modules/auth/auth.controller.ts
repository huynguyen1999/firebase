import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ChangePasswordDto,
  GoogleLoginDto,
  LoginDto,
  RegisterDto,
} from './dtos';
import { AuthService } from './auth.service';
import { User } from '../../interfaces/user.interface';
import { JwtAuthGuard } from './guards';
import { extractTokenFromHeader } from '../../utils/process-data';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      const data = await this.authService.register(body);
      res.status(200).json({ data, success: true }).end();
    } catch (exception) {
      console.log(exception);
      res
        .status(400)
        .json({ message: exception.message ?? 'Unknown error' })
        .end();
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const data = await this.authService.login(body);
      res.status(200).json({ data, success: true }).end();
    } catch (exception) {
      console.log(exception);
      res
        .status(400)
        .json({ message: exception.message ?? 'Unknown error' })
        .end();
    }
  }

  @Post('google-login')
  async googleLogin(@Body() body: GoogleLoginDto, @Res() res: Response) {
    try {
      const data = await this.authService.googleLogin(body);
      res.status(200).json({ data, success: true }).end();
    } catch (exception) {
      console.log(exception);
      res
        .status(400)
        .json({ message: exception.message ?? 'Unknown error' })
        .end();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req: Request & { user: Partial<User> },
    @Res() res: Response,
  ) {
    try {
      const data = await this.authService.changePassword(body, req.user);
      res.status(200).json({ data, success: true }).end();
    } catch (exception) {
      console.log(exception);
      res
        .status(400)
        .json({ message: exception.message ?? 'Unknown error' })
        .end();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() req: Request & { user: Partial<User> },
    @Res() res: Response,
  ) {
    try {
      const token = extractTokenFromHeader(req.headers.authorization);
      await this.authService.logout(token);
      res.status(200).json({ success: true }).end();
    } catch (exception) {
      console.log(exception);
      res
        .status(400)
        .json({ message: exception.message ?? 'Unknown error' })
        .end();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(
    @Req() req: Request & { user: Partial<User> },
    @Res() res: Response,
  ) {
    try {
      const data = await this.authService.getProfile(req.user);
      res.status(200).json({ data, success: true }).end();
    } catch (exception) {
      console.log(exception);
      res
        .status(400)
        .json({ message: exception.message ?? 'Unknown error' })
        .end();
    }
  }
}

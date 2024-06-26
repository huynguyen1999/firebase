import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { GetUsersDto } from './dtos';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../decorators';
import { USER_ROLES } from '../../constants';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getUsers(@Query() query: GetUsersDto, @Res() res: Response) {
    try {
      const data = await this.userService.getUsers(query);
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

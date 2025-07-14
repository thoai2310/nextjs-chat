import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  getAllUsers(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const currentUserId = req.user.userId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('currentUserId', req.user);
    return this.usersService.findAllExcept(currentUserId);
  }
}

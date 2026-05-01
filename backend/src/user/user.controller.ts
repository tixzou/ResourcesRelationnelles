import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // Route: GET http://localhost:3001/user
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
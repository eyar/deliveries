import {
    Controller,
    HttpStatus,
    Response,
    Post,
    Body,
  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Sender } from '../user/sender.entity';
import { Courier } from '../user/courier.entity';
import { UserDto  } from '../user/user.dto';
import { debug } from 'console';
  
@Controller('authenticate')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/')
  public async login(@Response() res, @Body() login: UserDto) {
    let user = await this.authService.login(login);
    
    const token = this.authService.signToken(user);

    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(HttpStatus.OK).json({token});
  }
}
  
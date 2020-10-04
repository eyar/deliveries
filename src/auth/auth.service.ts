import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from 'src/user/user.entity';
import { debug } from 'console';
import { Sender } from '../user/sender.entity';
import { Courier } from '../user/courier.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
    ) {}

  private readonly logger = new Logger(AuthService.name);
  
  signToken({email}): string {
    const payload = {
      sub: email,
    };
    return this.jwtService.sign(payload);
  }

  async verifyPayload(sub): Promise<User> {
    let user: User;

    try {
      user = await this.userService.findOne({ where: { email: sub } });
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${sub}`,
      );
    }
    delete user.password;

    return user;
  }

  async login(login: Sender | Courier): Promise<User> {
    let user: User;
    user = await this.userService.findOne({where: {email: login.email}});
    if(user && !(await user.checkPassword(login.password))){
      throw new UnauthorizedException(
        `Wrong password for user with email: ${login.email}`,
        );
      }
    else if(!user){
      user = await this.userService.create(login);
    }

    delete user.password;

    return user;
  }
}

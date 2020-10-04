import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { Sender } from './sender.entity';
import { Courier } from './courier.entity';
import { debug } from 'console';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Sender)
    private readonly senderRepository: Repository<Sender>,
    @InjectRepository(Courier)
    private readonly courierRepository: Repository<Courier>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Partial<Sender | Courier>): Promise<Sender | Courier> {
    switch(data.userType){
      case 'SENDER':
        return await this.senderRepository.save(new Sender(data));
        break;
      case 'COURIER':
        return await this.courierRepository.save(new Courier(data));
        break;
    }
  }

  async findOne(where: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(where);

    return user;
  }
}

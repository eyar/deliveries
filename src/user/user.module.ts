import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Sender } from './sender.entity';
import { Courier } from './courier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Sender,Courier])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

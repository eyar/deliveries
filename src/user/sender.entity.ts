import {
  ChildEntity,
  Column,
} from 'typeorm';
import {User} from '../user/user.entity'

@ChildEntity()
export class Sender extends User{

  @Column({nullable: true})
  companyName: string;

  constructor(data: Partial<Sender> = {}) {
    super();
    Object.assign(this, data);
  }
}

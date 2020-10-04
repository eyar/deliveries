import {
  ChildEntity,
  Column
} from 'typeorm';
import {User} from '../user/user.entity'

@ChildEntity()
export class Courier extends User{

  @Column()
  firstName: string;

  @Column()
  lastName: string;
  
  @Column()
  phoneNumber: string;
  
  @Column()
  vehicleType: string;
  
  constructor(data: Partial<Courier> = {}) {
    super();
    Object.assign(this, data);
  }
}

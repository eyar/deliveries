import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    TableInheritance,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { debug } from 'console';

export enum UserType{
  SENDER = 'SENDER',
  COURIER = 'COURIER'
}

@Entity()
@TableInheritance({ column: { type: "varchar", name: "userType" } })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
  
  @Column()
  readonly userType: UserType;

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

  @BeforeInsert()
  async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}

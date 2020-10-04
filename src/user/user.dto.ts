import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsEnum } from "class-validator";
import {UserType} from './user.entity'

export class UserDto {
    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'The password is required' })
    readonly password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'user type is required' })
    @IsEnum(UserType)
    readonly userType: UserType;
}

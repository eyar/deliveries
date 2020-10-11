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
    @IsEnum(UserType, {message: 'type can only be  COURIER or SENDER'})
    readonly userType: UserType;

    @ApiProperty()
    companyName: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;
    
    @ApiProperty()
    phoneNumber: string;
    
    @ApiProperty()
    vehicleType: string;
}

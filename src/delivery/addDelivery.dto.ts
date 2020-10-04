import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from "class-validator";

export class AddDeliveryDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'cost is required' })
    readonly cost: number;

    @ApiProperty()
    readonly packageSize: string;

    @ApiProperty()
    readonly description: string;
}
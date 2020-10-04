import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from "class-validator";

export class AssignDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'deliveryId is required' })
    readonly deliveryId: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'courierId is required' })
    readonly courierId: string;
}
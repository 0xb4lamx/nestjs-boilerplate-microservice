import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserIdRequestParamsDto {
    @IsString()
    @ApiProperty()
    readonly id!: string;
}

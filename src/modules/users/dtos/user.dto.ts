import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';

@Exclude()
export class UserDto extends AbstractDto {
    @Expose()
    @IsString()
    @ApiProperty()
    readonly id!: string;

    @Expose()
    @IsString()
    @ApiProperty()
    readonly firstName!: string;

    @Expose()
    @IsString()
    @ApiProperty()
    readonly lastName!: string;

    @Expose()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    readonly email: string;
}

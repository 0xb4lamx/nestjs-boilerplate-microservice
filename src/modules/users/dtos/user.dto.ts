import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/AbstractDto';

@Exclude()
export class UserDto extends AbstractDto {

    @Expose()
    @IsString()
    @ApiModelProperty()
    readonly id!: string;

    @Expose()
    @IsString()
    @ApiModelProperty()
    readonly firstName!: string;

    @Expose()
    @IsString()
    @ApiModelProperty()
    readonly lastName!: string;

    @Expose()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiModelProperty()
    readonly email: string;

}

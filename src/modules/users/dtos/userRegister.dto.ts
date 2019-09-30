'use strict';

import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
    @IsString()
    @IsNotEmpty()
    @ApiModelProperty()
    readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiModelProperty()
    readonly lastName: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiModelProperty()
    readonly email: string;
}

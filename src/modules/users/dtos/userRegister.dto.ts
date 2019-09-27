'use strict';

import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNotEmpty, IsPhoneNumber, IsOptional } from 'class-validator';
import { Column } from 'typeorm';

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

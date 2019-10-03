import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { User } from '../entities/user.entity';

export class UserDto extends AbstractDto {
    @IsString()
    @ApiModelProperty()
    readonly id!: string;

    @IsString()
    @ApiModelProperty()
    readonly firstName!: string;

    @IsString()
    @ApiModelProperty()
    readonly lastName!: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiModelProperty()
    readonly email: string;

    constructor(user?: User) {
        super(user);
        if (user) {
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.email = user.email;
        }
    }
}

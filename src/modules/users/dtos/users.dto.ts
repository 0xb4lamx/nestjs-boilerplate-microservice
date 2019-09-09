import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserIdRequestParamsDto {
    @IsString()
    readonly userId!: string;
}

export class UserDto {
    @IsString()
    @ApiModelProperty()
    readonly id!: string;
    @IsString()
    @ApiModelProperty()
    readonly firstName!: string;
    @IsString()
    @ApiModelProperty()
    readonly lastName!: string;
}

import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/AbstractDto';

export class UserIdRequestParamsDto {
    @IsString()
    readonly userId!: string;
}

export class UserDto extends AbstractDto {
    @IsString()
    @ApiModelProperty()
    readonly firstName!: string;
    @IsString()
    @ApiModelProperty()
    readonly lastName!: string;
}

import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserIdRequestParamsDto {
    @IsString()
    @ApiModelProperty()
    readonly id!: string;
}

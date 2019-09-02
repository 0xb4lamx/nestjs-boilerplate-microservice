import { IsString } from 'class-validator';

export class UserIdRequestParamsDto {
    @IsString()
    readonly userId!: string;
}

export class UserDto {
    @IsString()
    readonly userId!: string;
    @IsString()
    readonly firstName!: string;
    @IsString()
    readonly lastName!: string;
}

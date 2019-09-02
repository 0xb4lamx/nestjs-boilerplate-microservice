import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Delete,
    Put,
    HttpStatus,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { UserDto, UserIdRequestParamsDto } from '../dtos/users.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiUseTags('Users')
export class UsersController {
    constructor(private readonly _usersService: UsersService) {}

    /* Create User */
    /*--------------------------------------------*/
    @ApiOperation({ title: 'Create User' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User Created.' })
    @Post()
    async createUser(@Body() userDto: UserDto): Promise<UserDto> {
        const userId = Math.floor(Math.random() * (999 - 100 + 1) + 100);
        return this._usersService.createUser({ ...{ userId }, ...userDto });
    }

    /* Update User */
    /*--------------------------------------------*/
    @ApiOperation({ title: 'Update User' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Update User.' })
    @Put(':userId')
    async updateUser(
        @Param() userId: UserIdRequestParamsDto,
        @Body() userDto: UserDto,
    ) {
        return this._usersService.updateUser({ ...userId, ...userDto });
    }

    /* Delete User */
    /*--------------------------------------------*/
    @ApiOperation({ title: 'Delete User' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Delete User.' })
    @Delete(':userId')
    async deleteUser(@Param() userId: UserIdRequestParamsDto) {
        return this._usersService.deleteUser(userId);
    }

    /* TODO: List Users */
    /*--------------------------------------------*/
    @ApiOperation({ title: 'List Users' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List Users.' })
    @Get()
    async findUsers(@Param() param) {
        return this._usersService.findUsers();
    }

    /* TODO: Find User */
    /*--------------------------------------------*/
    @ApiOperation({ title: 'Get User' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get User.' })
    @Get(':userId')
    async findOneUser(@Param() userId: UserIdRequestParamsDto) {
        return this._usersService.findUsers();
    }
}

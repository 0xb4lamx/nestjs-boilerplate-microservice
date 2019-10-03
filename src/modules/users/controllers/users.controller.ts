import { Controller, Get, Post, Param, Body, Delete, Put, HttpStatus } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { UserDto } from '../dtos/user.dto';
import { UserIdRequestParamsDto } from '../dtos/userIdRequestParams.dto';
import { UserRegisterDto } from '../dtos/userRegister.dto';
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
    async createUser(@Body() userRegisterDto: UserRegisterDto): Promise<UserDto> {
        return this._usersService.createUser(userRegisterDto);
    }

    /* Update User */
    /*--------------------------------------------*/
    @ApiOperation({ title: 'Update User' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Update User.' })
    @Put(':id')
    async updateUser(
        @Param() id: UserIdRequestParamsDto,
        @Body() userDto: UserDto,
    ) {
        return this._usersService.updateUser({ ...id, ...userDto });
    }

    /* Delete User */
    /*--------------------------------------------*/
    @ApiOperation({ title: 'Delete User' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Delete User.' })
    @Delete(':id')
    async deleteUser(@Param() id: UserIdRequestParamsDto) {
        return this._usersService.deleteUser(id);
    }

    /*--------------------------------------------*/
    @ApiOperation({ title: 'List Users' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List Users.' })
    @Get()
    async findUsers(): Promise<UserDto[]> {
        return this._usersService.findUsers();
    }

    /*--------------------------------------------*/
    @ApiOperation({ title: 'Get User' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get User.' })
    @Get(':id')
    async findOneUser(@Param() id: UserIdRequestParamsDto): Promise<UserDto> {
        return this._usersService.findOneById(id);
    }
}

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
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { UserIdRequestParamsDto } from '../dtos/user-id-request-params.dto';
import { UserRegisterDto } from '../dtos/user-register.dto';
import { UserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private readonly _usersService: UsersService) {}

    /* Create User */
    @ApiOperation({ summary: 'Create User' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User Created.' })
    @Post()
    async createUser(@Body() userRegisterDto: UserRegisterDto) {
        return this._usersService.createUser(userRegisterDto);
    }

    /* Update User */
    @ApiOperation({ summary: 'Update User' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Update User.' })
    @Put(':id')
    async updateUser(
        @Param() id: UserIdRequestParamsDto,
        @Body() userDto: UserDto,
    ) {
        return this._usersService.updateUser({ ...id, ...userDto });
    }

    /* Delete User */
    @ApiOperation({ summary: 'Delete User' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Delete User.' })
    @Delete(':id')
    async deleteUser(@Param() id: UserIdRequestParamsDto) {
        return this._usersService.deleteUser(id);
    }

    /* Get users */
    @ApiOperation({ summary: 'List Users' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List Users.' })
    @Get()
    async findUsers(): Promise<UserDto[]> {
        return this._usersService.findUsers();
    }

    /* Get user*/
    @ApiOperation({ summary: 'Get User' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get User.' })
    @Get(':id')
    async findOneUser(@Param() id: UserIdRequestParamsDto): Promise<UserDto> {
        return this._usersService.findOneById(id);
    }
}

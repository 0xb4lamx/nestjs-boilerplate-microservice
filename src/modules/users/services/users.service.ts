import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateUserCommand } from '../commands/impl/create-user.command';
import { DeleteUserCommand } from '../commands/impl/delete-user.command';
import { UpdateUserCommand } from '../commands/impl/update-user.command';
import { UserDto, UserIdRequestParamsDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
    constructor(private readonly _commandBus: CommandBus) {}

    async createUser(user: UserDto) {
        return this._commandBus.execute(new CreateUserCommand(user));
    }

    async updateUser(user: UserDto) {
        return this._commandBus.execute(new UpdateUserCommand(user));
    }

    async deleteUser(user: UserIdRequestParamsDto) {
        return this._commandBus.execute(new DeleteUserCommand(user));
    }

    async findUsers() {
        // TODO
    }
}

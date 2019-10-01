import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateUserCommand } from '../commands/impl/create-user.command';
import { DeleteUserCommand } from '../commands/impl/delete-user.command';
import { UpdateUserCommand } from '../commands/impl/update-user.command';
import { UserDto } from '../dtos/user.dto';
import { UserIdRequestParamsDto } from '../dtos/userIdRequestParams.dto';
import { UserRegisterDto } from '../dtos/userRegister.dto';
import { GetUserQuery } from '../queries/impl/get-user.query';
import { GetUsersQuery } from '../queries/impl/get-users.query';

@Injectable()
export class UsersService {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus,
    ) {}

    async createUser(user: UserRegisterDto) {
        return this._commandBus.execute(new CreateUserCommand(user));
    }

    async updateUser(user: UserDto) {
        return this._commandBus.execute(new UpdateUserCommand(user));
    }

    async deleteUser(user: UserIdRequestParamsDto) {
        return this._commandBus.execute(new DeleteUserCommand(user));
    }

    async findOneById(user: UserIdRequestParamsDto): Promise<UserDto> {
        return this._queryBus.execute(new GetUserQuery({ id: user.id }));
    }

    async findUsers(): Promise<UserDto[]> {
        return this._queryBus.execute(new GetUsersQuery());
    }
}

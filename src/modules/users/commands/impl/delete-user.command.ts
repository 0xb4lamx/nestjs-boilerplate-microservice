import { ICommand } from '@nestjs/cqrs';

import { UserIdRequestParamsDto } from '../../dtos/users.dto';

export class DeleteUserCommand implements ICommand {
    constructor(public readonly userDto: UserIdRequestParamsDto) {}
}

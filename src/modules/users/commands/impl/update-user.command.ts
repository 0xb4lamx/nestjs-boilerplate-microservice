import { ICommand } from '@nestjs/cqrs';

import { UserDto } from '../../dtos/users.dto';

export class UpdateUserCommand implements ICommand {
    constructor(public readonly userDto: UserDto) {}
}

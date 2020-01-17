import { ICommand } from '@nestjs/cqrs';

import { UserRegisterDto } from '../../dtos/user-register.dto';

export class CreateUserCommand implements ICommand {
    constructor(public readonly userRegisterDto: UserRegisterDto) {}
}

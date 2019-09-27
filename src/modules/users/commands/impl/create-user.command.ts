import { ICommand } from '@nestjs/cqrs';

import { UserRegisterDto } from '../../dtos/userRegister.dto';

export class CreateUserCommand implements ICommand {
    constructor(public readonly userRegisterDto: UserRegisterDto) {}
}

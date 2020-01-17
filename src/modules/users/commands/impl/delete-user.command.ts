import { ICommand } from '@nestjs/cqrs';

import { UserIdRequestParamsDto } from '../../dtos/user-id-request-params.dto';

export class DeleteUserCommand implements ICommand {
    constructor(public readonly userDto: UserIdRequestParamsDto) {}
}

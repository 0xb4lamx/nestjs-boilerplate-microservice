import { IQuery } from '@nestjs/cqrs';

import { UserIdRequestParamsDto } from '../../dtos/users.dto';

export class GetUserQuery implements IQuery {
    constructor(public readonly userDto: UserIdRequestParamsDto) {}
}

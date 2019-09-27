import { IQuery } from '@nestjs/cqrs';

import { UserIdRequestParamsDto } from '../../dtos/user.dto';

export class GetUserQuery implements IQuery {
    constructor(public readonly userDto: UserIdRequestParamsDto) {}
}

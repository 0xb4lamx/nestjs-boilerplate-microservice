import { IQuery } from '@nestjs/cqrs';
import { FindConditions } from 'typeorm';

import { User } from '../../entities/user.entity';

export class GetUserQuery implements IQuery {
    constructor(public readonly findData: FindConditions<User>) {}
}

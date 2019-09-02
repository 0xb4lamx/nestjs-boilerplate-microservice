import { IEvent } from '@nestjs/cqrs';

import { UserDto } from '../../dtos/users.dto';

export class UserUpdatedEvent implements IEvent {
    constructor(public readonly userDto: UserDto) {}
}

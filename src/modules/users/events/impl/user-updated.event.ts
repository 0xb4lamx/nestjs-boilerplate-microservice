import { IEvent } from '@nestjs/cqrs';

import { UserDto } from '../../dtos/user.dto';

export class UserUpdatedEvent implements IEvent {
    constructor(public readonly userDto: UserDto) {}
}

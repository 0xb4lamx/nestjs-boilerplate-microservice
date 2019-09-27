import { IEvent } from '@nestjs/cqrs';

import { UserDto } from '../../dtos/user.dto';

export class UserCreatedEvent implements IEvent {
    constructor(public readonly userDto: UserDto) {}
}

import { IAggregateEvent } from 'nestjs-eventstore';

import { UserDto } from '../../dtos/user.dto';

export class UserAbstractEvent implements IAggregateEvent {
    constructor(public readonly userDto: UserDto) {}
    get streamName() {
        return `users-${this.userDto.id}`;
    }
}

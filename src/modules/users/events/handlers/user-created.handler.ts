import { Logger } from '@nestjs/common';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

import { UserCreatedEvent } from '../impl/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
    handle(event: UserCreatedEvent) {
        Logger.log(event, 'UserCreatedEvent'); // write here
    }
}

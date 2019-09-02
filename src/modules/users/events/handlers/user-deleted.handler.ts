import { Logger } from '@nestjs/common';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

import { UserDeletedEvent } from '../impl/user-deleted.event';

@EventsHandler(UserDeletedEvent)
export class UserDeletedHandler implements IEventHandler<UserDeletedEvent> {
    handle(event: UserDeletedEvent) {
        Logger.log(event, 'UserDeletedEvent'); // write here
    }
}

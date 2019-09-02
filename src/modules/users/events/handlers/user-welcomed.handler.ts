import { Logger } from '@nestjs/common';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

import { UserWelcomedEvent } from '../impl/user-welcomed.event';

@EventsHandler(UserWelcomedEvent)
export class UserWelcomedHandler implements IEventHandler<UserWelcomedEvent> {
    handle(event: UserWelcomedEvent) {
        Logger.log(event, 'UserWelcomedEvent'); // write here
    }
}

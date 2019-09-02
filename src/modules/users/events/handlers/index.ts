import { UserCreatedHandler } from './user-created.handler';
import { UserDeletedHandler } from './user-deleted.handler';
import { UserUpdatedHandler } from './user-updated.handler';
import { UserWelcomedHandler } from './user-welcomed.handler';

export const EventHandlers = [
    UserCreatedHandler,
    UserUpdatedHandler,
    UserDeletedHandler,
    UserWelcomedHandler,
];

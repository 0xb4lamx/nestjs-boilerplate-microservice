import { AggregateRoot } from '@nestjs/cqrs';

import { UserDto } from '../dtos/users.dto';
import { UserCreatedEvent } from '../events/impl/user-created.event';
import { UserDeletedEvent } from '../events/impl/user-deleted.event';
import { UserUpdatedEvent } from '../events/impl/user-updated.event';
import { UserWelcomedEvent } from '../events/impl/user-welcomed.event';

export class User extends AggregateRoot {
    [x: string]: any;
    private data;
    constructor(private readonly id: string | undefined) {
        super();
    }

    setData(data) {
        this.data = data;
    }

    createUser() {
        this.apply(new UserCreatedEvent(this.data));
    }

    updateUser() {
        this.apply(new UserUpdatedEvent(this.data));
    }

    welcomeUser() {
        this.apply(new UserWelcomedEvent(this.id));
    }

    deleteUser() {
        this.apply(new UserDeletedEvent(this.id));
    }
}

import { OnModuleInit, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus, CqrsModule } from '@nestjs/cqrs';

import { EventStore } from '../core/event-store/event-store';
import { EventStoreModule } from '../core/event-store/event-store.module';
import { CommandHandlers } from './commands/handlers';
import { UsersController } from './controllers/users.controller';
import { EventHandlers } from './events/handlers';
import { UserCreatedEvent } from './events/impl/user-created.event';
import { UserDeletedEvent } from './events/impl/user-deleted.event';
import { UserUpdatedEvent } from './events/impl/user-updated.event';
import { UserWelcomedEvent } from './events/impl/user-welcomed.event';
import { UserRepository } from './repository/user.repository';
import { UsersSagas } from './sagas/users.sagas';
import { UsersService } from './services/users.service';

@Module({
    imports: [CqrsModule, EventStoreModule.forFeature()],
    controllers: [UsersController],
    providers: [
        UsersService,
        UsersSagas,
        ...CommandHandlers,
        ...EventHandlers,
        UserRepository,
    ],
})
export class UsersModule implements OnModuleInit {
    constructor(
        private readonly _event$: EventBus,
        private readonly _eventStore: EventStore,
    ) {}

    onModuleInit() {
        this._eventStore.setEventHandlers(this.eventHandlers);
        this._eventStore.bridgeEventsTo((<any>this._event$).subject$);
        this._event$.publisher = this._eventStore;
    }

    eventHandlers = {
        UserCreatedEvent: (data) => new UserCreatedEvent(data),
        UserDeletedEvent: (data) => new UserDeletedEvent(data),
        UserUpdatedEvent: (data) => new UserUpdatedEvent(data),
        UserWelcomedEvent: (data) => new UserWelcomedEvent(data),
    };
}

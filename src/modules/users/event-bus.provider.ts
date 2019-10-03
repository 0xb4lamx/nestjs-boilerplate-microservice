import {
    EventStoreBusConfig,
    EventStoreSubscriptionType,
} from 'nestjs-eventstore';

import { UserCreatedEvent } from './events/impl/user-created.event';
import { UserDeletedEvent } from './events/impl/user-deleted.event';
import { UserUpdatedEvent } from './events/impl/user-updated.event';
import { UserWelcomedEvent } from './events/impl/user-welcomed.event';

const UserEventInstantiators = {
    UserCreatedEvent: (data) => new UserCreatedEvent(data),
    UserDeletedEvent: (data) => new UserDeletedEvent(data),
    UserUpdatedEvent: (data) => new UserUpdatedEvent(data),
    UserWelcomedEvent: (data) => new UserWelcomedEvent(data),
};

export const eventStoreBusConfig: EventStoreBusConfig = {
    subscriptions: [ // TODO: read about subs in eventStore, how can they help us.
        {
            // persistent subscription
            type: EventStoreSubscriptionType.Persistent,
            stream: '$ce-users',
            persistentSubscriptionName: 'g1',
        },
        {
            // Catchup subscription
            type: EventStoreSubscriptionType.CatchUp,
            stream: '$ce-users',
        },
    ],
    eventInstantiators: {
        ...UserEventInstantiators,
    },
};

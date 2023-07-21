import {
    EventStoreBusConfig,
    EventStoreSubscriptionType,
} from 'nestjs-eventstore';

import { UserCreatedEvent } from '../modules/users/events/impl/user-created.event';
import { UserDeletedEvent } from '../modules/users/events/impl/user-deleted.event';
import { UserUpdatedEvent } from '../modules/users/events/impl/user-updated.event';
import { UserWelcomedEvent } from '../modules/users/events/impl/user-welcomed.event';

const UserEventInstantiators = {
    UserCreatedEvent,
    UserDeletedEvent,
    UserUpdatedEvent,
    UserWelcomedEvent,
};

export const eventStoreBusConfig: EventStoreBusConfig = {
    subscriptions: [
        // TODO: read about subs in eventStore, how can they help us.
        // TODO: dont forget to create a `Persistent Subscription`
        // TODO: and enable `resolveLinkTos` https://eventstore.org/docs/dotnet-api/reading-events/index.html
        {
            // persistent subscription
            type: EventStoreSubscriptionType.Persistent,
            stream: '$ce-users',
            persistentSubscriptionName: 'g1',
        },
        {
            // example of persistent subscription to external stream events...
            type: EventStoreSubscriptionType.Persistent,
            stream: '$ce-orders',
            persistentSubscriptionName: 'g1',
        },
        // {
        //     // Catchup subscription
        //     type: EventStoreSubscriptionType.CatchUp,
        //     stream: '$ce-users',
        // },
    ],
    events: {
        ...UserEventInstantiators,
    },
};

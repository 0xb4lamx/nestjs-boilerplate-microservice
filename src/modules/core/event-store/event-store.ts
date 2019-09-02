import {
    Injectable,
    Inject,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { IEventPublisher, IMessageSource, IEvent } from '@nestjs/cqrs';
import * as http from 'http';
import { Subject } from 'rxjs';
import * as xml2js from 'xml2js';

import { ConfigService } from '../../../shared/services/config.service';

/**
 * @class EventStore
 * @description The EventStore.org bridge. By design, the domain _category
 * (i.e. user) events are being subscribed to. Upon events being received,
 * internal event handlers are responsible for the handling of events.
 */
@Injectable()
export class EventStore implements IEventPublisher, IMessageSource {
    private _eventStore: any;
    private _eventHandlers: object;
    private _category: string;
    private readonly _eventStoreHostUrl: string;

    constructor(
        @Inject('EVENT_STORE_PROVIDER') eventStore: any,
        configService: ConfigService,
    ) {
        this._category = 'users';
        this._eventStore = eventStore;
        this._eventStore.connect(configService.eventStoreConfig);
        this._eventStoreHostUrl =
            configService.eventStoreConfig.protocol +
            `://${configService.eventStoreConfig.hostname}:${configService.eventStoreConfig.httpPort}/streams/`;
    }

    async publish<T extends IEvent>(event: T) {
        const message = JSON.parse(JSON.stringify(event));
        const userId = message.userId || message.userDto.userId;
        const streamName = `${this._category}-${userId}`;
        const type = event.constructor.name;
        try {
            await this._eventStore.client.writeEvent(streamName, type, event);
        } catch (err) {
            console.trace(err);
        }
    }

    /**
     * @description Event Store bridge subscribes to domain _category stream
     * @param subject
     */
    async bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
        const streamName = `$ce-${this._category}`;

        const onEvent = async (event) => {
            const eventUrl =
                this._eventStoreHostUrl +
                `${event.metadata.$o}/${event.data.split('@')[0]}`;
            http.get(eventUrl, (res) => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    xml2js.parseString(rawData, (err, result) => {
                        if (err) {
                            console.trace(err);
                            return;
                        }
                        const content = result['atom:entry']['atom:content'][0];
                        const eventType = content.eventType[0];
                        const data = content.data[0];
                        event = this._eventHandlers[eventType](
                            ...Object.values(data),
                        );
                        subject.next(event);
                    });
                });
            });
        };

        const onDropped = (subscription, reason, error) => {
            console.trace(subscription, reason, error);
        };

        try {
            await this._eventStore.client.subscribeToStream(
                streamName,
                onEvent,
                onDropped,
                false,
            );
        } catch (err) {
            console.trace(err);
        }
    }

    setEventHandlers(eventHandlers) {
        this._eventHandlers = eventHandlers;
    }
}

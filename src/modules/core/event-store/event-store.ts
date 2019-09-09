import { Injectable } from '@nestjs/common';
import { IEventPublisher, IMessageSource, IEvent } from '@nestjs/cqrs';
import { TCPClient } from 'geteventstore-promise';
import * as http from 'http';
import { Subject } from 'rxjs';
import * as xml2js from 'xml2js';

import { ConfigService } from '../../../shared/services/config.service';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * @class EventStore
 * @description The EventStore.org bridge. By design, the domain _category
 * (i.e. user) events are being subscribed to. Upon events being received,
 * internal event handlers are responsible for the handling of events.
 */
@Injectable()
export class EventStore implements IEventPublisher, IMessageSource {
    private _client: TCPClient;
    private _eventHandlers: object;
    private _category: string;
    private readonly _eventStoreHostUrl: string;

    constructor(private readonly _configService: ConfigService,
                private readonly _logger: LoggerService) {
        this._category = 'users';
        try {
            this._client = new TCPClient({
                hostname: _configService.eventStoreConfig.hostname,
                port: _configService.eventStoreConfig.tcpPort,
                credentials: _configService.eventStoreConfig.credentials,
                poolOptions: _configService.eventStoreConfig.poolOptions,
            });
            _logger.log('EventStore connected successfully.');
        } catch (e) {
            _logger.error(e.message);
        }
        this._eventStoreHostUrl =
            _configService.eventStoreConfig.protocol +
            `://${_configService.eventStoreConfig.hostname}:${_configService.eventStoreConfig.httpPort}/streams/`;
    }

    async publish<T extends IEvent>(event: T) {

        const message = JSON.parse(JSON.stringify(event));
        const id = message.userDto.id;
        const streamName = `${this._category}-${id}`;
        const type = event.constructor.name;
        const metadata = {
            _aggregate_id: id,
            _ocurred_on: new Date().getTime(),
        };

        try {
            await this._client.writeEvent(streamName, type, event, metadata);
        } catch (err) {
            this._logger.error(err.message, err.stack);
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
                            this._logger.error(err.message, err.stack);
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
            this._logger.error(error.message, error.stack);
        };

        try {
            await this._client.subscribeToStream(
                streamName,
                onEvent,
                onDropped,
                false,
            );
        } catch (err) {
            this._logger.error(err.message, err.stack);
        }
    }

    setEventHandlers(eventHandlers) {
        this._eventHandlers = eventHandlers;
    }
}

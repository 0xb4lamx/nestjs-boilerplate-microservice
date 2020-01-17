import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { MicroserviceHealthIndicator, TypeOrmHealthIndicator, TerminusEndpoint, TerminusModuleOptions, TerminusOptionsFactory } from '@nestjs/terminus';

import { ConfigService } from '../shared/services/config.service';

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
    constructor(
        private readonly _microservice: MicroserviceHealthIndicator,
        private readonly _db: TypeOrmHealthIndicator,
        private readonly _configService: ConfigService,
    ) {
    }

    createTerminusOptions(): TerminusModuleOptions {
        const healthEndpoint: TerminusEndpoint = {
            url: '/healthcheck',
            healthIndicators: [
                async () => this._microservice.pingCheck('tcp', {
                    transport: Transport.TCP,
                    options: { host: 'localhost', port: this._configService.getNumber('TRANSPORT_PORT') },
                }),
                async () => this._microservice.pingCheck('EventStore', {// TODO: design a custom EventStore healthIndicator
                    transport: Transport.TCP,
                    options: { host: this._configService.get('EVENT_STORE_HOSTNAME'), port: this._configService.getNumber('EVENT_STORE_TCP_PORT') },
                }),
                async () => this._db.pingCheck('database'),
            ],
        };
        return {
            endpoints: [healthEndpoint],
        };
    }
}

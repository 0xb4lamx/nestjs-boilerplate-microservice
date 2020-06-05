import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    MicroserviceHealthIndicator,
    TypeOrmHealthIndicator,
    HealthCheck,
    HealthCheckService,
} from '@nestjs/terminus';

import { AppService } from './app.service';
import { ConfigService } from './shared/services/config.service';
import { LoggerService } from './shared/services/logger.service';

@Controller('/')
@ApiTags('helloworld')
export class AppController {
    constructor(
        private readonly _appService: AppService,
        private readonly _logger: LoggerService,
        private health: HealthCheckService,
        private readonly microservice: MicroserviceHealthIndicator,
        private readonly db: TypeOrmHealthIndicator,
        private readonly configService: ConfigService,
    ) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, description: 'Hello world' })
    getHello(): string {
        this._logger.info('Hello Friend, world!');
        return this._appService.getHello();
    }

    @Get('healthcheck')
    @HealthCheck()
    healthCheck() {
        return this.health.check([
            async () =>
                this.microservice.pingCheck('EventStore', {
                    // TODO: design a custom EventStore healthIndicator
                    transport: Transport.TCP,
                    options: {
                        host: this.configService.get('EVENT_STORE_HOSTNAME'),
                        port: this.configService.getNumber(
                            'EVENT_STORE_TCP_PORT',
                        ),
                    },
                }),
            async () => this.db.pingCheck('database'),
        ]);
    }
}

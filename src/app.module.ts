import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared.module';
import { ConfigService } from './shared/services/config.service';
import { EventStoreCqrsModule } from 'nestjs-eventstore';
import { eventStoreBusConfig } from './providers/event-bus.provider';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) => configService.typeOrmConfig,
            inject: [ConfigService],
        }),
        EventStoreCqrsModule.forRootAsync(
            {
                useFactory: async (config: ConfigService) => {
                    return {
                        connectionSettings: config.eventStoreConfig.connectionSettings,
                        endpoint: config.eventStoreConfig.tcpEndpoint,
                    };
                },
                inject: [ConfigService],
            },
            eventStoreBusConfig,
        ),
        UsersModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

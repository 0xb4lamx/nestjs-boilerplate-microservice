import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStoreCqrsModule } from 'nestjs-eventstore';

import { ConfigService } from '../../shared/services/config.service';
import { CommandHandlers } from './commands/handlers';
import { UsersController } from './controllers/users.controller';
import { eventStoreBusConfig } from './event-bus.provider';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';
import { UserRepository } from './repository/user.repository';
import { UsersSagas } from './sagas/users.sagas';
import { UsersService } from './services/users.service';
import { UsersResolver } from './graphql/users.resolver';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
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
        GraphQLFederationModule.forRootAsync({
            useFactory: () => ({
                typePaths: ['./**/*.graphql'],
              }),
        }),
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        ...CommandHandlers,
        ...EventHandlers,
        ...QueryHandlers,
        UsersSagas,
        UsersResolver, // GraphQL resolver
    ],
})
export class UsersModule {}

import { Logger } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { EventPublisher } from 'nestjs-eventstore';

import { UserRepository } from '../../repository/user.repository';
import { WelcomeUserCommand } from '../impl/welcome-user.command';

@CommandHandler(WelcomeUserCommand)
export class WelcomeUserHandler implements ICommandHandler<WelcomeUserCommand> {
    constructor(
        private readonly _repository: UserRepository,
        private readonly _publisher: EventPublisher,
    ) {}

    async execute(command: WelcomeUserCommand) {
        Logger.log('Async WelcomeUserHandler...', 'WelcomeUserCommand');

        const { id } = command;
        const user = this._publisher.mergeObjectContext(
            await this._repository.welcomeUser({ id }),
        );
        user.commit();
    }
}

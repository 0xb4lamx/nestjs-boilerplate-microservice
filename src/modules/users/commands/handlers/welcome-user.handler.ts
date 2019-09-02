import { Logger } from '@nestjs/common';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';

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
        const { userId } = command;
        const user = this._publisher.mergeObjectContext(
            await this._repository.welcomeUser({ userId }),
        );
        user.commit();
    }
}

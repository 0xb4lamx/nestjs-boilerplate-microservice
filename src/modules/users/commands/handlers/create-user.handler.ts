import { Logger } from '@nestjs/common';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../repository/user.repository';
import { CreateUserCommand } from '../impl/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly _repository: UserRepository,
        private readonly _publisher: EventPublisher,
    ) {}

    async execute(command: CreateUserCommand) {
        Logger.log('Async CreateUserHandler...', 'CreateUserCommand');

        const { userDto } = command;
        const user = this._publisher.mergeObjectContext(
            await this._repository.createUser(userDto),
        );
        user.commit();
    }
}

import { Logger } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { EventPublisher } from 'nestjs-eventstore';

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

        const { userRegisterDto } = command;
        const user = this._publisher.mergeObjectContext(
            await this._repository.createUser(userRegisterDto),
        );
        user.commit();
    }
}

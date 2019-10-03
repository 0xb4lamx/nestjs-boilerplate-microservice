import { Logger } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { EventPublisher } from 'nestjs-eventstore';

import { UserRepository } from '../../repository/user.repository';
import { UpdateUserCommand } from '../impl/update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(
        private readonly _repository: UserRepository,
        private readonly _publisher: EventPublisher,
    ) {}

    async execute(command: UpdateUserCommand) {
        Logger.log('Async UpdateUserHandler...', 'UpdateUserCommand');

        const { userDto } = command;
        const user = this._publisher.mergeObjectContext(
            await this._repository.updateUser(userDto),
        );
        user.commit();
    }
}

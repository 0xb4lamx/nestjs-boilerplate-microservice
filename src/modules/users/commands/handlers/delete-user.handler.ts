import { Logger } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { EventPublisher } from 'nestjs-eventstore';

import { UserRepository } from '../../repository/user.repository';
import { DeleteUserCommand } from '../impl/delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(
        private readonly _repository: UserRepository,
        private readonly _publisher: EventPublisher,
    ) {}

    async execute(command: DeleteUserCommand) {
        Logger.log('Async DeleteUserHandler...', 'DeleteUserCommand');
        const { userDto } = command;
        const user = this._publisher.mergeObjectContext(
            await this._repository.deleteUser(userDto),
        );
        user.commit();
    }
}

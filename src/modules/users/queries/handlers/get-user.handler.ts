import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserNotFoundException } from '../../../../exceptions/user-not-found.exception';
import { LoggerService } from '../../../../shared/services/logger.service';
import { UserDto } from '../../dtos/user.dto';
import { UserRepository } from '../../repository/user.repository';
import { GetUserQuery } from '../impl/get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
    constructor(
        private readonly _repository: UserRepository,
        private readonly _logger: LoggerService,
    ) {}

    async execute(query: GetUserQuery): Promise<UserDto> {
        this._logger.log('[query] Async GetUserQuery...');
        const { findData } = query;
        const user = await this._repository.findOne(findData);
        if (!user) {
            throw new UserNotFoundException();
        }
        return user.toDto();
    }
}

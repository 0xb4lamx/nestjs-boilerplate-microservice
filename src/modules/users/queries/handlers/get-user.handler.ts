import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { LoggerService } from '../../../../shared/services/logger.service';
import { UserRepository } from '../../repository/user.repository';
import { GetUserQuery } from '../impl/get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
    constructor(private readonly _repository: UserRepository,
                private readonly _logger: LoggerService) {}

    async execute(query: GetUserQuery) {
        this._logger.log('[query] Async GetUserQuery...');
        return this._repository.findOneById(query);
    }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { LoggerService } from '../../../../shared/services/logger.service';
import { UserRepository } from '../../repository/user.repository';
import { GetUsersQuery } from '../impl/get-users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly _repository: UserRepository,
              private readonly _logger: LoggerService) {}

  async execute() {
    this._logger.log('[query] Async GetUsersQuery...');
    return this._repository.findAll();
  }
}

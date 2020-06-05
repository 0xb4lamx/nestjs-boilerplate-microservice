import { Args, Query, Resolver } from '@nestjs/graphql';

import { UsersService } from '../services/users.service';

@Resolver('User')
export class UsersResolver {
    constructor(private readonly _usersService: UsersService) {}

    @Query()
    user(@Args('id') id: string) {
        return this._usersService.findOneById({ id });
    }

    @Query()
    users() {
        return this._usersService.findUsers();
    }
}

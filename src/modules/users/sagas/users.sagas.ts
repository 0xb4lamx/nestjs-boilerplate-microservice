import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { WelcomeUserCommand } from '../commands/impl/welcome-user.command';
import { UserCreatedEvent } from '../events/impl/user-created.event';

@Injectable()
export class UsersSagas {
    @Saga()
    userCreated = (events$: Observable<any>): Observable<ICommand> => {
        return events$.pipe(
            ofType(UserCreatedEvent),
            delay(1000),
            map((event) => {
                Logger.log('Inside [UsersSagas] Saga', 'UsersSagas');
                const userId = event.userDto.id;
                return new WelcomeUserCommand(userId);
            }),
        );
    };
}

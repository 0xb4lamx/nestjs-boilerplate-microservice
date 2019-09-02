import { CreateUserHandler } from './create-user.handler';
import { DeleteUserHandler } from './delete-user.handler';
import { UpdateUserHandler } from './update-user.handler';
import { WelcomeUserHandler } from './welcome-user.handler';

export const CommandHandlers = [
    CreateUserHandler,
    DeleteUserHandler,
    UpdateUserHandler,
    WelcomeUserHandler,
];

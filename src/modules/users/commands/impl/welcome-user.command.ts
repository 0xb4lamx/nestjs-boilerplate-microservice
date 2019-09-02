import { ICommand } from '@nestjs/cqrs';

export class WelcomeUserCommand implements ICommand {
    constructor(public readonly userId: string) {}
}

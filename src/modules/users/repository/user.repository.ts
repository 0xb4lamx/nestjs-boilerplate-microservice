import { Injectable } from '@nestjs/common';

import { User } from '../models/user.model';

@Injectable()
export class UserRepository {
    async createUser(userDto) {
        const user = new User(undefined);
        user.setData(userDto);
        user.createUser();
        return user;
    }

    async updateUser(userDto) {
        const user = new User(userDto.id);
        user.setData(userDto);
        user.updateUser();
        return user;
    }

    async deleteUser(userDto) {
        const user = new User(userDto.id);
        user.deleteUser();
        return user;
    }

    async welcomeUser(userDto) {
        const user = new User(userDto.id);
        user.welcomeUser();
        return user;
    }

    async findOneById(userDto): Promise<User[]> {
        return [];
    }

    async findAll(): Promise<User[]> {
        return [];
    }

}

import { Repository, EntityRepository } from 'typeorm';

import { UserDto } from '../dtos/user.dto';
import { UserRegisterDto } from '../dtos/userRegister.dto';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async createUser(userRegisterDto: UserRegisterDto) {
        const user = super.create(userRegisterDto);
        this.save(user);
        user.create();
        return user;
    }

    async updateUser(userDto) {
        const user = new User();
        user.update();
        return user;
    }

    async deleteUser(userDto) {
        const user = new User();
        user.delete();
        return user;
    }

    async welcomeUser(userDto) {
        const user = new User();
        user.welcome();
        return user;
    }

    async findOneById(userDto): Promise<User[]> {
        return [];
    }

    async findAll(): Promise<User[]> {
        return [];
    }

}

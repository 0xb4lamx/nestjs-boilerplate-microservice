import { Repository, EntityRepository } from 'typeorm';
import * as uuidv4 from 'uuid/v4';

import { UserRegisterDto } from '../dtos/userRegister.dto';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async createUser(userRegisterDto: UserRegisterDto) {
        const id = uuidv4();
        const user = await this.save(super.create({...{id}, ...userRegisterDto}));
        user.create();
        return user;
    }

    async updateUser(userDto) {
        const updateResult = await super.update({ id: userDto.id }, userDto);
        const updatedUser = await super.findOne({ id: userDto.id });
        updatedUser.update();
        return updatedUser;
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
}

import { Repository, EntityRepository } from 'typeorm';

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

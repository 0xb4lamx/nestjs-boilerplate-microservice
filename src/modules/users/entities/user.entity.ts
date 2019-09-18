import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UserDto } from '../dtos/users.dto';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ unique: true, nullable: true })
    email: string;

    dtoClass = UserDto;
}

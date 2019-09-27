'use strict';
import { AggregateRoot } from '@nestjs/cqrs';
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { UtilsService } from '../providers/utils.service';
import { AbstractDto } from './dto/AbstractDto';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> extends AggregateRoot {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    abstract dtoClass: new (entity: AbstractEntity) => T;

    toDto() {
        return UtilsService.toDto(this.dtoClass, this);
    }
}

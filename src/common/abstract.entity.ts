'use strict';

import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { UtilsService } from '../providers/utils.service';
import { AbstractDto } from './dto/AbstractDto';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at' })
    updatedAt: Date;

    abstract dtoClass: new (entity: AbstractEntity) => T;

    toDto() {
        return UtilsService.toDto(this.dtoClass, this);
    }
}

'use strict';
import { AggregateRoot } from '@nestjs/cqrs';
import { IAggregateEvent } from 'nestjs-eventstore';
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity extends AggregateRoot<IAggregateEvent> {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    abstract toDto();
}

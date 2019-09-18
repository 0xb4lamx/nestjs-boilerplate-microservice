'use strict';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
    @IsString()
    @ApiModelProperty()
    readonly id!: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(entity: AbstractEntity) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }

}

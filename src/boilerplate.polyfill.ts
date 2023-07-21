'use strict';

import * as _ from 'lodash';

import { AbstractEntity } from './common/abstract.entity';
import { AbstractDto } from './common/dto/abstract.dto';

declare global {
    interface Array<T> {
        toDtos<B extends AbstractDto>(this: AbstractEntity[]): B[];
    }
}

Array.prototype.toDtos = function <B extends AbstractDto>(): B[] {
    return _(this)
        .map((item) => item.toDto())
        .compact()
        .value() as B[];
};

'use strict';

import * as _ from 'lodash';

import { AbstractEntity } from './common/abstract.entity';
import { AbstractDto } from './common/dto/abstract.dto';

declare global {
// tslint:disable-next-line:naming-convention no-unused
    interface Array<T> {
        toDtos<B extends AbstractDto>(this: AbstractEntity[]): B[];
    }
}

Array.prototype.toDtos = function<B extends AbstractDto>(): B[] {
    // tslint:disable-next-line:no-invalid-this
    return _(this).map((item) => item.toDto()).compact().value() as B[];
};

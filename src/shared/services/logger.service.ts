import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

import { ConfigService } from './config.service';

@Injectable()
export class LoggerService {
    private readonly _logger: winston.Logger;

    constructor(public configService: ConfigService) {
        this._logger = winston.createLogger(configService.winstonConfig);
        if (configService.nodeEnv !== 'production') {
            this._logger.debug('Logging initialized at debug level');
        }
    }
    log(message: string): void {
        this._logger.info(message);
    }
    info(message: string): void {
        this._logger.info(message);
    }
    debug(message: string): void {
        this._logger.debug(message);
    }
    error(message: string, trace?: any): void {
        // i think the trace should be JSON Stringified
        this._logger.error(`${message} -> (${trace || 'trace not provided !'})`);
    }
    warn(message: string): void {
        this._logger.warn(message);
    }

}

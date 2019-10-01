import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { LoggerService } from '../shared/services/logger.service';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {

    constructor(public reflector: Reflector, private readonly _logger: LoggerService) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            code: status,
            timestamp: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            path: request.url,
            method: request.method,
            error:
                status !== HttpStatus.INTERNAL_SERVER_ERROR
                    ? exception.message.error || null
                    : 'Internal server error',
            message:
                exception.message || null,
        };

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this._logger.error(
                `${request.method} ${request.url}`,
                exception.stack,
                'ExceptionFilter',
            );
        } else {
            this._logger.error(
                `${request.method} ${request.url}`,
                JSON.stringify(errorResponse),
                'ExceptionFilter',
            );
        }

        response.status(status).json(errorResponse);
    }
}

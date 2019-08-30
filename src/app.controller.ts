import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { LoggerService } from './shared/services/logger.service';

@Controller('/')
@ApiUseTags('helloworld')
export class AppController {
    constructor(private readonly _appService: AppService, private readonly _logger: LoggerService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, description: 'Hello world'})
    getHello(): string {
        this._logger.info('Hello Friend, world!');
        return this._appService.getHello();
    }
}

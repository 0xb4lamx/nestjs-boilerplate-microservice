import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
    NestExpressApplication,
    ExpressAdapter,
} from '@nestjs/platform-express';
import rateLimit from 'express-rate-limit';
import * as helmet from 'helmet'; // security feature
import * as morgan from 'morgan'; // HTTP request logger

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigService } from './shared/services/config.service';
import { LoggerService } from './shared/services/logger.service';
import { setupSwagger } from './shared/swagger/setup';
import { SharedModule } from './shared.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
        { cors: true },
    );

    const loggerService = app.select(SharedModule).get(LoggerService);
    app.useLogger(loggerService);
    app.use(
        morgan('combined', {
            stream: {
                write: (message) => {
                    loggerService.log(message);
                },
            },
        }),
    );

    app.use(helmet());
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        }),
    );

    const reflector = app.get(Reflector);

    app.useGlobalFilters(new HttpExceptionFilter(loggerService));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            // exceptionFactory: errors => new BadRequestException(errors),
            // dismissDefaultMessages: true,//TODO: disable in prod (if required)
            validationError: {
                target: false,
            },
        }),
    );

    const configService = app.select(SharedModule).get(ConfigService);

    if (['development', 'staging'].includes(configService.nodeEnv)) {
        setupSwagger(app, configService.swaggerConfig);
    }

    const port = configService.getNumber('PORT') || 3000;
    const host = configService.get('HOST') || '127.0.0.1';
    await app.listen(port, host);

    loggerService.warn(`server running on port ${host}:${port}`);

    /*
     if GRPC is needed, import src/shared/grpc/setup.ts
     await setupGrpc(app, 'role', 'role.proto', configService.services?.auth?.grpcPort || 7900);
     */
}
bootstrap();

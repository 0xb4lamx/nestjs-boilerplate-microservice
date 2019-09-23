import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import * as RateLimit from 'express-rate-limit';
import * as helmet from 'helmet'; // security feature
import * as morgan from 'morgan'; // HTTP request logger
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';
import { setupSwagger } from './b2h-swagger';
import { HttpErrorFilter } from './filters/http-exception.filter';
import { SharedModule } from './shared.module';
import { ConfigService } from './shared/services/config.service';
import { LoggerService } from './shared/services/logger.service';

async function bootstrap() {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), { cors: true});

    const loggerService = app.select(SharedModule).get(LoggerService);
    app.useLogger(loggerService);
    app.use(morgan('combined', {stream: {write: (message) => {loggerService.log(message); }}}));

    app.use(helmet());
    app.use(new RateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    }));

    const reflector = app.get(Reflector);

    app.useGlobalFilters(new HttpErrorFilter(reflector, loggerService));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        dismissDefaultMessages: true,
        validationError: {
            target: false,
        },
    }));

    const configService = app.select(SharedModule).get(ConfigService);
    app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            port: configService.getNumber('TRANSPORT_PORT') || 4000,
            retryAttempts: 5,
            retryDelay: 3000,
        },
    });

    await app.startAllMicroservicesAsync();

    if (['development', 'staging'].includes(configService.nodeEnv)) {
        setupSwagger(app);
    }

    const port = configService.getNumber('PORT') || 3000;
    const host = configService.get('HOST') || '127.0.0.1';
    await app.listen(port, host);

    loggerService.warn(`server running on port ${host}:${port}`);

}
bootstrap();

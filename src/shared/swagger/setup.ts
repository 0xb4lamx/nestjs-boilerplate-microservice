import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ISwaggerConfigInterface } from '../../interfaces/swagger-config.interface';

export function setupSwagger(
    app: INestApplication,
    config: ISwaggerConfigInterface,
) {
    const options = new DocumentBuilder()
        .setTitle(config.title)
        .setDescription(config.description)
        .setVersion(config.version)
        .addBearerAuth()
        .addServer(`${config.scheme}://`)
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(config.path, app, document);
}

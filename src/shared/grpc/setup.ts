import { join } from 'path';

import { INestApplication } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

export async function setupGrpc(
    app: INestApplication,
    packageName,
    fileName: string,
    port: number,
    host = '0.0.0.0',
) {
    app.connectMicroservice({
        transport: Transport.GRPC,
        options: {
            url: `${host}:${port}`,
            package: packageName,
            protoPath: join(`proto/${fileName}`),
        },
    });

    await app.startAllMicroservices();
}

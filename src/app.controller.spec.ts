import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared.module';

describe('AppController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            imports: [SharedModule],
            controllers: [AppController],
            providers: [AppService],
        }).compile();
    });

    describe('getHello', () => {
        it('should return "Hello World!"', () => {
            const appController = app.get<AppController>(AppController);
            expect(appController.getHello()).toBe('Hello World!');
        });
    });
});

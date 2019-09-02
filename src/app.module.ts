import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared.module';

@Module({
    imports: [
        SharedModule,
        UsersModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

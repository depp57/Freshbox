import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BackendConfigModule } from '@freshbox/backend-config';

@Module({
  imports: [BackendConfigModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { \[guests\]Module } from './[guests/]/[guests/].module';

@Module({
  imports: [\[guests\]Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

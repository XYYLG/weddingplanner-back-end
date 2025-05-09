import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuestModule } from './modules/guests/guest.module';
import { FinanceModule } from './modules/finance/finance.module';

@Module({
  imports: [GuestModule, FinanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuestModule } from './modules/guests/guest.model';
import { FinanceModel } from './modules/finance/finance.model';

@Module({
  imports: [GuestModule, FinanceModel],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

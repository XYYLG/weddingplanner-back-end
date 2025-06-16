import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuestModule } from './modules/guests/guest.module';
import { FinanceModule } from './modules/finance/finance.module';
import { Auth0Module } from './modules/Auth0/auth0.module';

@Module({
  imports: [GuestModule, FinanceModule, Auth0Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

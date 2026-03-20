import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PaymentListener } from './listeners/payment.listener';
import { AppService } from './services/order/order.service';

@Module({
  imports: [],
  controllers: [AppController, PaymentListener],
  providers: [AppService],
})
export class AppModule {}

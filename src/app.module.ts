import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { InventoryListener } from './listeners/inventory.listener';
import { NotificationListener } from './listeners/notification.listener';
import { PaymentListener } from './listeners/payment.listener';
import { ShippingListener } from './listeners/shipping.listener';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'orders',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'payments',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'INVENTORY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'inventory',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'SHIPPING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'shipping',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'notifications',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    PaymentListener,
    NotificationListener,
    InventoryListener,
    ShippingListener,
  ],
  providers: [],
})
export class AppModule {}

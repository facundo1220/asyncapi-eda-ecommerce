import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class AppService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'orders_queue',
        queueOptions: { durable: false },
      },
    });
  }

  createOrder(orderId: number) {
    this.client.emit('pedido.creado', { orderId });
    console.log('Evento emitido: pedido.creado', { orderId });
  }
}

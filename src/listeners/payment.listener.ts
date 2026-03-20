import { Controller } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Controller()
export class PaymentListener {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'payments_queue',
        queueOptions: { durable: false },
      },
    });
  }

  @EventPattern('pedido.creado')
  handleOrderCreated(
    @Payload() data: { orderId: string; userId: string; total: number },
  ) {
    console.log('Orden recibida en microservicio:', data);
    const pagoExitoso = Math.random() > 0.5;
    if (pagoExitoso) {
      this.client.emit('pago.procesado', {
        orderId: data.orderId,
        status: 'approved',
      });
      console.log('Evento emitido: pago.procesado', {
        orderId: data.orderId,
        status: 'approved',
      });
    } else {
      this.client.emit('pago.rechazado', {
        orderId: data.orderId,
        reason: 'Fondos insuficientes',
      });
      console.log('Evento emitido: pago.rechazado', {
        orderId: data.orderId,
        reason: 'Fondos insuficientes',
      });
    }
  }
}

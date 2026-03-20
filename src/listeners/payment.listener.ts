import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { appLogger } from '../logger';

@Controller()
export class PaymentListener {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: { orderId: number }) {
    appLogger.info('Orden recibida en PaymentListener', {
      orderId: data.orderId,
    });

    const pagoExitoso = Math.random() > 0.5;

    if (pagoExitoso) {
      this.client.emit('pago_procesado', {
        orderId: data.orderId,
        status: 'approved',
      });
      appLogger.info('Evento emitido: pago_procesado', {
        orderId: data.orderId,
        status: 'approved',
      });
    } else {
      this.client.emit('pago_rechazado', {
        orderId: data.orderId,
        reason: 'Fondos insuficientes',
      });
      appLogger.info('Evento emitido: pago_rechazado', {
        orderId: data.orderId,
        reason: 'Fondos insuficientes',
      });
    }
  }
}

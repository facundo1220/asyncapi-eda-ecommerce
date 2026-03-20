import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class PaymentListener {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: { orderId: number }) {
    console.log('Orden recibida en PaymentListener:', data.orderId);

    const pagoExitoso = Math.random() > 0.5;

    if (pagoExitoso) {
      this.client.emit('pago_procesado', {
        orderId: data.orderId,
        status: 'approved',
      });
      console.log('Evento emitido: pago_procesado', {
        orderId: data.orderId,
        status: 'approved',
      });
    } else {
      this.client.emit('pago_rechazado', {
        orderId: data.orderId,
        reason: 'Fondos insuficientes',
      });
      console.log('Evento emitido: pago_rechazado', {
        orderId: data.orderId,
        reason: 'Fondos insuficientes',
      });
    }
  }
}

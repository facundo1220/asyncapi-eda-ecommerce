import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ShippingListener {
  constructor(
    @Inject('SHIPPING_SERVICE') private readonly client: ClientProxy,
  ) {}

  @EventPattern('pago_procesado')
  handlePagoProcesado(@Payload() data: { orderId: string; status: string }) {
    console.log('Pago procesado recibido en ShippingListener:', data);

    this.client.emit('envio_creado', {
      envioId: 'e1',
      orderId: data.orderId,
      address: 'Calle Falsa 123',
    });

    console.log('Evento emitido: envio_creado', {
      envioId: 'e1',
      orderId: data.orderId,
      address: 'Calle Falsa 123',
    });
  }
}

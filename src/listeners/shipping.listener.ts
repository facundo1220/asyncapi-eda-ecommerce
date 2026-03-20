import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { appLogger } from '../logger';

@Controller()
export class ShippingListener {
  constructor(
    @Inject('SHIPPING_SERVICE') private readonly client: ClientProxy,
  ) {}

  @EventPattern('pago_procesado')
  handlePagoProcesado(@Payload() data: { orderId: string; status: string }) {
    appLogger.info('Pago procesado recibido en ShippingListener', { data });

    this.client.emit('envio_creado', {
      envioId: 'e1',
      orderId: data.orderId,
      address: 'Calle Falsa 123',
    });

    appLogger.info('Evento emitido: envio_creado', {
      envioId: 'e1',
      orderId: data.orderId,
      address: 'Calle Falsa 123',
    });
  }
}

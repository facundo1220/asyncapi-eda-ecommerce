import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class InventoryListener {
  constructor(
    @Inject('INVENTORY_SERVICE') private readonly client: ClientProxy,
  ) {}

  @EventPattern('pago_procesado')
  handlePagoProcesado(@Payload() data: { orderId: number; status: string }) {
    console.log('Pago procesado recibido en InventoryListener:', data);

    this.client.emit('inventario_descontado', {
      orderId: data.orderId,
      productId: 'p1',
      quantity: 2,
    });

    console.log('Evento emitido: inventario_descontado', {
      orderId: data.orderId,
      productId: 'p1',
      quantity: 2,
    });
  }
}

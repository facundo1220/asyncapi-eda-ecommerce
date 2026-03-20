import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationListener {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
  ) {}

  @EventPattern('pago_rechazado')
  handlePagoRechazado(@Payload() data: { orderId: string; reason: string }) {
    console.log('Pago rechazado recibido en NotificationListener:', data);

    this.client.emit('notificacion_enviada', {
      notificationId: 'n1',
      userId: 'u1',
      message: `Pago rechazado para pedido ${data.orderId}: ${data.reason}`,
    });
    console.log('Evento emitido: notificacion_enviada', {
      notificationId: 'n1',
      userId: 'u1',
      message: `Pago rechazado para pedido ${data.orderId}: ${data.reason}`,
    });
  }
}

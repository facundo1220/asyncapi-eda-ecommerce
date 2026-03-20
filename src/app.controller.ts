import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';

class CreateOrderDto {
  orderId: number;
}

@ApiTags('order')
@Controller('order')
export class AppController {
  constructor(@Inject('ORDER_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      example: { value: { orderId: 123 } },
    },
  })
  createOrder(@Body() body: CreateOrderDto) {
    this.client.emit('order_created', { orderId: body.orderId });
    console.log('Evento enviado: order_created', { orderId: body.orderId });
    return { message: 'Evento enviado', orderId: body.orderId };
  }
}

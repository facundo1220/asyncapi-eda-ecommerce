import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AppService } from './services/order/order.service';

class CreateOrderDto {
  orderId: number;
}

@ApiTags('order')
@Controller('order')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      example: {
        value: { orderId: 123 },
      },
    },
  })
  createOrder(@Body() body: CreateOrderDto) {
    this.appService.createOrder(body.orderId);
    return { message: 'Evento enviado', orderId: body.orderId };
  }
}

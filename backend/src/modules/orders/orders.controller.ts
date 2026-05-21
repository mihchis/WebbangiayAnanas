import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Headers,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 1. Checkout Endpoint - Supports both Guest and Authenticated Checkouts
  @Post()
  async checkout(
    @Body() dto: CreateOrderDto,
    @Headers('authorization') authHeader?: string,
  ) {
    let userId: string | null = null;

    // Dynamically check if JWT token is present to link order to user account
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        });
        userId = payload.userId;
      } catch (e) {
        // Safe to ignore: fall back to guest checkout if token is expired/invalid
      }
    }

    return this.ordersService.createOrder(userId, dto);
  }

  // 2. Fetch Order History - Restricted to Authenticated User
  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrderHistory(@GetUser() user: any) {
    return this.ordersService.findAllForUser(user.id);
  }

  // 3. Get Specific Order Details
  @Get(':id')
  async getOrderDetails(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        });
        userId = payload.userId;
      } catch (e) {
        // Fall back to public check
      }
    }

    return this.ordersService.findOne(userId, id);
  }
}

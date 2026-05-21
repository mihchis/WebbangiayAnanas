import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductVariant } from '../products/entities/variant.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  // 1. Create order within secure transactional bounds
  async createOrder(userId: string | null, dto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const orderItemsToSave: OrderItem[] = [];

      // Loop through all items and lock variants individually to prevent race conditions
      for (const item of dto.items) {
        const variant = await queryRunner.manager.findOne(ProductVariant, {
          where: { id: item.productVariantId },
          lock: { mode: 'pessimistic_write' }, // Pessimistic row locking (no joins)
        });

        if (!variant) {
          throw new NotFoundException(`Product variant '${item.productVariantId}' not found`);
        }

        // Fetch product relation separately without lock to bypass Postgres FOR UPDATE limitation on joined tables
        const variantWithProduct = await queryRunner.manager.findOne(ProductVariant, {
          where: { id: item.productVariantId },
          relations: { product: true },
        });
        if (variantWithProduct) {
          variant.product = variantWithProduct.product;
        }

        if (variant.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for shoe "${variant.product.name}". Available: ${variant.stock}, Requested: ${item.quantity}`,
          );
        }

        // Deduct variant stock
        variant.stock -= item.quantity;
        await queryRunner.manager.save(ProductVariant, variant);

        // Calculate line item pricing
        const price = Number(variant.product.price);
        totalAmount += price * item.quantity;

        // Create line item record
        const orderItem = queryRunner.manager.create(OrderItem, {
          productVariant: variant,
          price,
          quantity: item.quantity,
        });

        orderItemsToSave.push(orderItem);
      }

      // Create main Order entity — user is optional (guest checkout supported)
      const orderData: Partial<Order> = {
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,
        note: dto.note,
        totalAmount,
        status: OrderStatus.PENDING,
      };

      if (userId) {
        orderData.user = { id: userId } as User;
      }

      const order = queryRunner.manager.create(Order, orderData);
      const savedOrder = await queryRunner.manager.save(Order, order);

      // Save all order items linked to order
      for (const orderItem of orderItemsToSave) {
        orderItem.order = savedOrder;
      }
      await queryRunner.manager.save(OrderItem, orderItemsToSave);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Return fully populated order
      return this.findOne(userId, savedOrder.id);
    } catch (err) {
      // Rollback transaction on error to prevent data corruption/orphaned entries
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Release connection
      await queryRunner.release();
    }
  }

  // 2. Fetch order history for a specific authenticated user
  async findAllForUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: {
        items: {
          productVariant: {
            product: true,
            color: true,
            size: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  // 3. Retrieve specific order details (restricted by user ownership or auth role)
  async findOne(userId: string | null, orderId: string): Promise<Order> {
    const qb = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.productVariant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .leftJoinAndSelect('variant.color', 'color')
      .leftJoinAndSelect('variant.size', 'size')
      .where('order.id = :orderId', { orderId });

    if (userId) {
      qb.andWhere('order.user_id = :userId', { userId });
    }

    const order = await qb.getOne();

    if (!order) {
      throw new NotFoundException(`Order with ID '${orderId}' not found`);
    }

    return order;
  }
}

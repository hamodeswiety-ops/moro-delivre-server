import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { NotificationService } from '../../common/notifications/notification.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemsRepository: Repository<OrderItemEntity>,
    private notificationService: NotificationService,
  ) {}

  async create(createOrderDto: any, storeId: string) {
    const order = this.ordersRepository.create({
      ...createOrderDto,
      store: { id: storeId },
      trackingNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: OrderStatus.PENDING,
      totalPrice: 0,
    });

    const savedOrder = (await this.ordersRepository.save(order)) as any;
    return this.findById(savedOrder.id);
  }

  async findAll(storeId?: string, status?: OrderStatus) {
    const query = this.ordersRepository.createQueryBuilder('order');

    if (storeId) {
      query.where('order.storeId = :storeId', { storeId });
    }

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    return query.leftJoinAndSelect('order.items', 'items').getMany();
  }

  async findById(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'store', 'delivery'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findById(id);
    order.status = status;
    const updated = await this.ordersRepository.save(order);

    // Send notification based on status
    if (status === OrderStatus.CONFIRMED) {
      await this.notificationService.notifyOrderConfirmed(
        'customer@example.com',
        '+1234567890',
        order.trackingNumber,
      );
    } else if (status === OrderStatus.IN_DELIVERY) {
      await this.notificationService.notifyOrderShipped(
        'customer@example.com',
        '+1234567890',
        order.trackingNumber,
        order.trackingNumber,
      );
    } else if (status === OrderStatus.DELIVERED) {
      await this.notificationService.notifyOrderDelivered(
        'customer@example.com',
        '+1234567890',
        order.trackingNumber,
      );
    }

    return updated;
  }

  async addItems(orderId: string, items: any[]) {
    const order = await this.findById(orderId);

    let totalPrice = 0;
    for (const item of items) {
      const orderItem = this.orderItemsRepository.create({
        order,
        product: { id: item.productId },
        quantity: item.quantity,
        price: item.price,
      });
      await this.orderItemsRepository.save(orderItem);
      totalPrice += item.price * item.quantity;
    }

    order.totalPrice = totalPrice;
    return this.ordersRepository.save(order);
  }
}

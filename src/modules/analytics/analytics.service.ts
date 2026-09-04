import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from '../orders/entities/order.entity';
import { PaymentEntity, PaymentStatus } from '../payments/entities/payment.entity';
import { DeliveryEntity, DeliveryStatus } from '../delivery/entities/delivery.entity';
import { StoreEntity } from '../stores/entities/store.entity';
import { UserEntity, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(PaymentEntity)
    private paymentsRepository: Repository<PaymentEntity>,
    @InjectRepository(DeliveryEntity)
    private deliveryRepository: Repository<DeliveryEntity>,
    @InjectRepository(StoreEntity)
    private storesRepository: Repository<StoreEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getDashboardSummary(storeId?: string) {
    const query = storeId ? { store: { id: storeId } } : undefined;

    const totalOrders = storeId
      ? await this.ordersRepository.count({ where: { store: { id: storeId } } })
      : await this.ordersRepository.count();

    const totalRevenue = await this.getTotalRevenue(storeId);

    const activeDeliveries = storeId
      ? await this.deliveryRepository.count({ where: { status: DeliveryStatus.IN_TRANSIT, order: { store: { id: storeId } } } })
      : await this.deliveryRepository.count({ where: { status: DeliveryStatus.IN_TRANSIT } });

    const completedOrders = storeId
      ? await this.ordersRepository.count({ where: { status: OrderStatus.DELIVERED, store: { id: storeId } } })
      : await this.ordersRepository.count({ where: { status: OrderStatus.DELIVERED } });

    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      activeDeliveries,
      completionRate:
        totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(2) : 0,
      pendingOrders: totalOrders - completedOrders,
    };
  }

  async getTotalRevenue(storeId?: string) {
    const payments = storeId
      ? await this.paymentsRepository.find({
          where: { status: PaymentStatus.COMPLETED, order: { store: { id: storeId } } },
          relations: ['order'],
        })
      : await this.paymentsRepository.find({
          where: { status: PaymentStatus.COMPLETED },
          relations: ['order'],
        });

    return payments.reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);
  }

  async getTotalOrders(storeId?: string, startDate?: Date, endDate?: Date) {
    const query = this.ordersRepository.createQueryBuilder('order');

    if (storeId) {
      query.where('order.storeId = :storeId', { storeId });
    }

    if (startDate) {
      query.andWhere('order.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('order.createdAt <= :endDate', { endDate });
    }

    return query.getCount();
  }

  async getActiveDeliveries(storeId?: string) {
    if (storeId) {
      return this.deliveryRepository.count({
        where: { status: DeliveryStatus.IN_TRANSIT, order: { store: { id: storeId } } },
      });
    }
    return this.deliveryRepository.count({ where: { status: DeliveryStatus.IN_TRANSIT } });
  }

  async getTopProducts(storeId?: string, limit: number = 10) {
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product');

    if (storeId) {
      query.where('order.storeId = :storeId', { storeId });
    }

    const orders = await query.getMany();

    const productSales = new Map<string, { id: string; name: string; quantity: number; revenue: number }>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.product.id;
        if (productSales.has(key)) {
          const current = productSales.get(key)!;
          current.quantity += item.quantity;
          current.revenue += parseFloat(item.price.toString()) * item.quantity;
        } else {
          productSales.set(key, {
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            revenue: parseFloat(item.price.toString()) * item.quantity,
          });
        }
      });
    });

    return Array.from(productSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  }

  async getRevenueByStore() {
    const stores = await this.storesRepository.find();
    const revenueByStore = [];

    for (const store of stores) {
      const revenue = await this.getTotalRevenue(store.id);
      const orders = await this.getTotalOrders(store.id);
      const averageOrderValue = orders > 0 ? revenue / orders : 0;

      revenueByStore.push({
        storeId: store.id,
        storeName: store.name,
        revenue: parseFloat(revenue.toFixed(2)),
        orders,
        averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      });
    }

    return revenueByStore.sort((a, b) => b.revenue - a.revenue);
  }

  async getDeliveryStatistics(storeId?: string) {
    let deliveryQuery = this.deliveryRepository.createQueryBuilder('delivery');
    if (storeId) {
      deliveryQuery = deliveryQuery.leftJoin('delivery.order', 'order').where('order.storeId = :storeId', { storeId });
    }

    const delivered = await deliveryQuery
      .clone()
      .andWhere('delivery.status = :status', { status: DeliveryStatus.DELIVERED })
      .getCount();

    const inTransit = await deliveryQuery
      .clone()
      .andWhere('delivery.status = :status', { status: DeliveryStatus.IN_TRANSIT })
      .getCount();

    const failed = await deliveryQuery
      .clone()
      .andWhere('delivery.status = :status', { status: DeliveryStatus.FAILED })
      .getCount();

    const assigned = await deliveryQuery
      .clone()
      .andWhere('delivery.status = :status', { status: DeliveryStatus.ASSIGNED })
      .getCount();

    const total = delivered + inTransit + failed + assigned;

    return {
      delivered,
      inTransit,
      failed,
      assigned,
      total,
      deliveryRate: total > 0 ? ((delivered / total) * 100).toFixed(2) : 0,
      failureRate: total > 0 ? ((failed / total) * 100).toFixed(2) : 0,
    };
  }

  async getOrderStatusDistribution(storeId?: string) {
    const statuses = Object.values(OrderStatus);
    const distribution = [];

    for (const status of statuses) {
      const count = storeId
        ? await this.ordersRepository.count({ where: { status, store: { id: storeId } } })
        : await this.ordersRepository.count({ where: { status } });
      distribution.push({
        status,
        count,
      });
    }

    return distribution;
  }

  async getPaymentMethodDistribution(storeId?: string) {
    const payments = storeId
      ? await this.paymentsRepository.find({
          where: { order: { store: { id: storeId } } },
          relations: ['order'],
        })
      : await this.paymentsRepository.find();

    const methodMap = new Map<string, number>();

    payments.forEach((payment) => {
      const count = methodMap.get(payment.method) || 0;
      methodMap.set(payment.method, count + 1);
    });

    return Array.from(methodMap.entries()).map(([method, count]) => ({
      method,
      count,
    }));
  }

  async getRevenueByDate(storeId?: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const query = this.paymentsRepository
      .createQueryBuilder('payment')
      .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .andWhere('payment.createdAt >= :startDate', { startDate });

    if (storeId) {
      query.leftJoin('payment.order', 'order').andWhere('order.storeId = :storeId', { storeId });
    }

    const payments = await query.leftJoinAndSelect('payment.order', 'order').getMany();

    const revenueByDate = new Map<string, number>();

    payments.forEach((payment) => {
      const date = payment.createdAt.toISOString().split('T')[0];
      const current = revenueByDate.get(date) || 0;
      revenueByDate.set(date, current + parseFloat(payment.amount.toString()));
    });

    return Array.from(revenueByDate.entries())
      .map(([date, revenue]) => ({
        date,
        revenue: parseFloat(revenue.toFixed(2)),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getDriverPerformance(storeId?: string) {
    const drivers = await this.usersRepository.find({
      where: { role: UserRole.DRIVER },
    });

    const performance = [];

    for (const driver of drivers) {
      const deliveries = storeId
        ? await this.deliveryRepository.find({
            where: { driver: { id: driver.id }, order: { store: { id: storeId } } },
          })
        : await this.deliveryRepository.find({
            where: { driver: { id: driver.id } },
          });

      const completed = deliveries.filter((d) => d.status === DeliveryStatus.DELIVERED).length;
      const failed = deliveries.filter((d) => d.status === DeliveryStatus.FAILED).length;

      performance.push({
        driverId: driver.id,
        driverName: `${driver.firstName} ${driver.lastName}`,
        totalDeliveries: deliveries.length,
        completedDeliveries: completed,
        failedDeliveries: failed,
        successRate:
          deliveries.length > 0 ? ((completed / deliveries.length) * 100).toFixed(2) : 0,
      });
    }

    return performance.sort((a, b) => parseFloat(b.successRate as string) - parseFloat(a.successRate as string));
  }

  async getMonthlyRevenueTrend(storeId?: string, months: number = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const query = this.paymentsRepository
      .createQueryBuilder('payment')
      .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .andWhere('payment.createdAt >= :startDate', { startDate });

    if (storeId) {
      query.leftJoin('payment.order', 'order').andWhere('order.storeId = :storeId', { storeId });
    }

    const payments = await query.leftJoinAndSelect('payment.order', 'order').getMany();

    const revenueByMonth = new Map<string, number>();

    payments.forEach((payment) => {
      const date = payment.createdAt;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = revenueByMonth.get(monthKey) || 0;
      revenueByMonth.set(monthKey, current + parseFloat(payment.amount.toString()));
    });

    return Array.from(revenueByMonth.entries())
      .map(([month, revenue]) => ({
        month,
        revenue: parseFloat(revenue.toFixed(2)),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  async getCustomerStatistics(storeId?: string) {
    let orderQuery = this.ordersRepository.createQueryBuilder('order');

    if (storeId) {
      orderQuery = orderQuery.where('order.storeId = :storeId', { storeId });
    }

    const totalCustomers = await orderQuery
      .clone()
      .select('COUNT(DISTINCT order.customerEmail)', 'count')
      .getRawOne();

    const repeatCustomersCount = await orderQuery
      .clone()
      .groupBy('order.customerEmail')
      .having('COUNT(*) > 1')
      .getCount();

    const averageOrderValue = await orderQuery
      .clone()
      .select('AVG(order.totalPrice)', 'avg')
      .getRawOne();

    const total = parseInt(totalCustomers?.count || '0');

    return {
      totalCustomers: total,
      repeatCustomers: repeatCustomersCount,
      newCustomers: total - repeatCustomersCount,
      repeatCustomerRate: total > 0 ? ((repeatCustomersCount / total) * 100).toFixed(2) : 0,
      averageOrderValue: parseFloat(averageOrderValue?.avg || '0').toFixed(2),
    };
  }
}

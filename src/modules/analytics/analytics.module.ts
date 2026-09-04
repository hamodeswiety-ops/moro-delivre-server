import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { OrderEntity } from '../orders/entities/order.entity';
import { PaymentEntity } from '../payments/entities/payment.entity';
import { DeliveryEntity } from '../delivery/entities/delivery.entity';
import { StoreEntity } from '../stores/entities/store.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      PaymentEntity,
      DeliveryEntity,
      StoreEntity,
      UserEntity,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

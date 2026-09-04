import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { StoreEntity } from '../../stores/entities/store.entity';
import { OrderItemEntity } from './order-item.entity';
import { DeliveryEntity } from '../../delivery/entities/delivery.entity';
import { RatingEntity } from '../../ratings/entities/rating.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PACKED = 'packed',
  READY_FOR_DELIVERY = 'ready_for_delivery',
  IN_DELIVERY = 'in_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  trackingNumber: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  customerPhone: string;

  @Column()
  deliveryAddress: string;

  @Column({ nullable: true })
  customerNotes: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToOne(() => StoreEntity, (store) => store.orders, {
    onDelete: 'CASCADE',
  })
  store: StoreEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    cascade: true,
  })
  items: OrderItemEntity[];

  @OneToOne(() => DeliveryEntity, (delivery) => delivery.order, {
    nullable: true,
  })
  delivery: DeliveryEntity;

  @OneToMany(() => RatingEntity, (rating) => rating.order)
  ratings: RatingEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

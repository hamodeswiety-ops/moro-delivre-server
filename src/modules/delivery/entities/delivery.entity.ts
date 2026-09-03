import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { OrderEntity } from '../../orders/entities/order.entity';
import { UserEntity } from '../../users/entities/user.entity';

export enum DeliveryStatus {
  ASSIGNED = 'assigned',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

@Entity('deliveries')
export class DeliveryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => OrderEntity, (order) => order.delivery, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: OrderEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  driver: UserEntity;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.ASSIGNED,
  })
  status: DeliveryStatus;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

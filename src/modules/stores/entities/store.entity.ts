import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { OrderEntity } from '../../orders/entities/order.entity';

export enum StoreStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

@Entity('stores')
export class StoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: StoreStatus, default: StoreStatus.PENDING })
  status: StoreStatus;

  @OneToOne(() => UserEntity, (user) => user.store)
  owner: UserEntity;

  @OneToMany(() => ProductEntity, (product) => product.store)
  products: ProductEntity[];

  @OneToMany(() => OrderEntity, (order) => order.store)
  orders: OrderEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

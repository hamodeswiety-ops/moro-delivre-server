import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity';
import { OrderEntity } from '../../orders/entities/order.entity';

@Entity('ratings')
export class RatingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column()
  customerEmail: string;

  @Column()
  customerName: string;

  @ManyToOne(() => ProductEntity, (product) => product.ratings, { onDelete: 'CASCADE' })
  product: ProductEntity;

  @Column()
  productId: string;

  @ManyToOne(() => OrderEntity, (order) => order.ratings, { onDelete: 'CASCADE' })
  order: OrderEntity;

  @Column()
  orderId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

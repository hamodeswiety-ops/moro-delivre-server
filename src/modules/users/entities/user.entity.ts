import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StoreEntity } from '../../stores/entities/store.entity';
import { DreamHomeProject } from '../../dream-homes/entities/dream-home-project.entity';

export enum UserRole {
  ADMIN = 'admin',
  STORE_OWNER = 'store_owner',
  DRIVER = 'driver',
  CUSTOMER = 'customer',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => StoreEntity, (store) => store.owner, { nullable: true })
  @JoinColumn()
  store: StoreEntity;

  @OneToMany(() => DreamHomeProject, (project) => project.user, { nullable: true })
  dreamProjects: DreamHomeProject[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

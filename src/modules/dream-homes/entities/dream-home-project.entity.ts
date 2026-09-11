import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { DreamDesign } from './dream-design.entity';
import { ProjectFloor } from './project-floor.entity';

export enum PropertyType {
  VILLA = 'villa',
  APARTMENT = 'apartment',
  TOWNHOUSE = 'townhouse',
  MANSION = 'mansion',
  DUPLEX = 'duplex',
}

export enum ProjectStatus {
  DRAFT = 'draft',
  DESIGNING = 'designing',
  ESTIMATING = 'estimating',
  REVIEWING = 'reviewing',
  APPROVED = 'approved',
  BUILDING = 'building',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

@Entity('dream_home_projects')
@Index(['userId', 'status'])
@Index(['userId', 'createdAt'])
export class DreamHomeProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: PropertyType })
  propertyType: PropertyType;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.DRAFT })
  status: ProjectStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  totalArea: number; // m²

  @Column('integer', { default: 0 })
  floorsCount: number;

  @Column('integer', { default: 0 })
  roomsCount: number;

  @Column('integer', { default: 0 })
  bathroomsCount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  estimatedBudget: number; // USD

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  actualCost: number; // USD

  @Column('jsonb', { nullable: true })
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };

  @Column('jsonb', { nullable: true })
  specifications: {
    architecture: string;
    style: string;
    features: string[];
    specialRequirements: string[];
  };

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  completionPercentage: number;

  @ManyToOne(() => UserEntity, (user) => user.dreamProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column('uuid')
  userId: string;

  @OneToMany(() => DreamDesign, (design) => design.project, {
    cascade: true,
    eager: false,
  })
  designs: DreamDesign[];

  @OneToMany(() => ProjectFloor, (floor) => floor.project, {
    cascade: true,
    eager: false,
  })
  floors: ProjectFloor[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('timestamp', { nullable: true })
  deletedAt: Date;

  // Methods
  getTotalCost(): number {
    return this.actualCost || 0;
  }

  isOverBudget(): boolean {
    return this.actualCost > this.estimatedBudget;
  }

  getBudgetRemaining(): number {
    return this.estimatedBudget - this.actualCost;
  }
}

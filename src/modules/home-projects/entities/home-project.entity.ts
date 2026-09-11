import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectFloor } from './project-floor.entity';
import { ProjectDesign } from './project-design.entity';

export enum ProjectStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum PropertyType {
  VILLA = 'villa',
  APARTMENT = 'apartment',
  TOWNHOUSE = 'townhouse',
  MANSION = 'mansion',
  DUPLEX = 'duplex',
}

@Entity('home_projects')
export class HomeProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectName: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: PropertyType })
  propertyType: PropertyType;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.DRAFT })
  status: ProjectStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalArea: number; // Square meters

  @Column({ type: 'integer', default: 0 })
  numberOfFloors: number;

  @Column({ type: 'integer', default: 0 })
  numberOfRooms: number;

  @Column({ type: 'integer', default: 0 })
  numberOfBathrooms: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  estimatedBudget: number; // USD

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  currentCost: number; // USD

  @Column({ type: 'json', nullable: true })
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
  };

  @Column({ type: 'json', nullable: true })
  specifications: {
    architecture: string;
    style: string;
    colors: string[];
    features: string[];
  };

  @ManyToOne(() => User, (user) => user.homeProjects)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => ProjectFloor, (floor) => floor.project, {
    cascade: true,
    eager: true,
  })
  floors: ProjectFloor[];

  @OneToMany(() => ProjectDesign, (design) => design.project, {
    cascade: true,
    eager: true,
  })
  designs: ProjectDesign[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

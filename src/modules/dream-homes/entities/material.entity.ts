import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum MaterialCategory {
  EXTERIOR = 'exterior',
  ROOFING = 'roofing',
  FLOORING = 'flooring',
  WALLS = 'walls',
  DOORS = 'doors',
  WINDOWS = 'windows',
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  HVAC = 'hvac',
  FINISHES = 'finishes',
}

export enum UnitType {
  SQUARE_METER = 'm2',
  PIECE = 'piece',
  KILOGRAM = 'kg',
  METER = 'meter',
  LITER = 'liter',
}

@Entity('materials')
@Index(['category'])
@Index(['name'])
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column({ type: 'enum', enum: MaterialCategory })
  category: MaterialCategory;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number; // USD

  @Column({ type: 'enum', enum: UnitType })
  unitType: UnitType;

  @Column('varchar', { length: 255, nullable: true })
  supplier: string;

  @Column('integer', { nullable: true })
  durabilityYears: number;

  @Column('boolean', { default: false })
  isEcoFriendly: boolean;

  @Column('text', { nullable: true })
  imageUrl: string;

  @Column('varchar', { length: 50, nullable: true })
  color: string;

  @Column('varchar', { length: 50, nullable: true })
  texture: string;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number; // 0-5

  @Column('integer', { default: 0 })
  reviews: number;

  @Column('boolean', { default: true })
  isAvailable: boolean;

  @Column('jsonb', { nullable: true })
  specifications: Record<string, any>;

  @Column('simple-array', { default: () => 'ARRAY[]::text[]' })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

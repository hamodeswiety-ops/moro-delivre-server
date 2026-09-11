import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectFloor } from './project-floor.entity';

export enum RoomType {
  BEDROOM = 'bedroom',
  BATHROOM = 'bathroom',
  KITCHEN = 'kitchen',
  LIVING_ROOM = 'living_room',
  DINING_ROOM = 'dining_room',
  OFFICE = 'office',
  GARAGE = 'garage',
  STORAGE = 'storage',
  HALLWAY = 'hallway',
  BALCONY = 'balcony',
  LAUNDRY = 'laundry',
  MUDROOM = 'mudroom',
}

@Entity('project_rooms')
export class ProjectRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column({ type: 'enum', enum: RoomType })
  type: RoomType;

  @Column('decimal', { precision: 10, scale: 2 })
  area: number; // m²

  @Column('decimal', { precision: 8, scale: 2 })
  length: number;

  @Column('decimal', { precision: 8, scale: 2 })
  width: number;

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  height: number;

  @Column('integer', { default: 0 })
  windowsCount: number;

  @Column('integer', { default: 0 })
  doorsCount: number;

  @Column('jsonb', { nullable: true })
  fixtures: {
    flooring: string;
    wallPaint: string;
    ceiling: string;
    lighting: string[];
  };

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  estimatedCost: number;

  @Column('simple-array', { default: () => 'ARRAY[]::text[]' })
  features: string[];

  @ManyToOne(() => ProjectFloor, (floor) => floor.rooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'floorId' })
  floor: ProjectFloor;

  @Column('uuid')
  floorId: string;
}

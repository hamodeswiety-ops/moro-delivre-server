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
  LIVING = 'living_room',
  DINING = 'dining_room',
  OFFICE = 'office',
  GARAGE = 'garage',
  STORAGE = 'storage',
  HALLWAY = 'hallway',
  BALCONY = 'balcony',
}

@Entity('project_rooms')
export class ProjectRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomName: string;

  @Column({ type: 'enum', enum: RoomType })
  roomType: RoomType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  area: number; // Square meters

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  length: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  width: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'simple-array', nullable: true })
  windows: string[];

  @Column({ type: 'simple-array', nullable: true })
  doors: string[];

  @Column({ type: 'json', nullable: true })
  fixtures: {
    flooring: string;
    wallPaint: string;
    ceiling: string;
    lighting: string[];
  };

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  estimatedCost: number;

  @ManyToOne(() => ProjectFloor, (floor) => floor.rooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'floorId' })
  floor: ProjectFloor;

  @Column()
  floorId: string;
}

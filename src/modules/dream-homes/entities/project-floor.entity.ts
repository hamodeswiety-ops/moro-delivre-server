import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { DreamHomeProject } from './dream-home-project.entity';
import { ProjectRoom } from './project-room.entity';

@Entity('project_floors')
export class ProjectFloor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer')
  floorNumber: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  area: number; // m²

  @Column('jsonb', { nullable: true })
  layout: {
    width: number;
    length: number;
    height: number;
    orientation: string;
  };

  @Column('simple-array', { default: () => 'ARRAY[]::text[]' })
  amenities: string[];

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  estimatedCost: number;

  @ManyToOne(() => DreamHomeProject, (project) => project.floors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: DreamHomeProject;

  @Column('uuid')
  projectId: string;

  @OneToMany(() => ProjectRoom, (room) => room.floor, {
    cascade: true,
    eager: false,
  })
  rooms: ProjectRoom[];
}

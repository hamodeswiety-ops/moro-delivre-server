import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { HomeProject } from './home-project.entity';
import { ProjectRoom } from './project-room.entity';

@Entity('project_floors')
export class ProjectFloor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  floorNumber: number;

  @Column()
  floorName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  area: number; // Square meters

  @Column({ type: 'json', nullable: true })
  layout: {
    width: number;
    length: number;
    orientation: string;
  };

  @Column({ type: 'simple-array', nullable: true })
  amenities: string[];

  @ManyToOne(() => HomeProject, (project) => project.floors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: HomeProject;

  @Column()
  projectId: string;

  @OneToMany(() => ProjectRoom, (room) => room.floor, {
    cascade: true,
    eager: true,
  })
  rooms: ProjectRoom[];
}

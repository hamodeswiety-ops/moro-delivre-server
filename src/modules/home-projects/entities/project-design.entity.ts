import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { HomeProject } from './home-project.entity';

export enum DesignStyle {
  MODERN = 'modern',
  CLASSIC = 'classic',
  CONTEMPORARY = 'contemporary',
  MINIMALIST = 'minimalist',
  TRADITIONAL = 'traditional',
  INDUSTRIAL = 'industrial',
  RUSTIC = 'rustic',
  MEDITERRANEAN = 'mediterranean',
  SCANDINAVIAN = 'scandinavian',
  BOHEMIAN = 'bohemian',
}

@Entity('project_designs')
export class ProjectDesign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  designName: string;

  @Column({ type: 'enum', enum: DesignStyle })
  style: DesignStyle;

  @Column({ type: 'simple-array' })
  colorPalette: string[]; // Hex colors

  @Column({ type: 'json' })
  materials: {
    exterior: string;
    roofing: string;
    flooring: string;
    walls: string;
    doors: string;
    windows: string;
  };

  @Column({ type: 'simple-array', nullable: true })
  features: string[];

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalCost: number;

  @Column({ type: 'json', nullable: true })
  visualizationUrl: {
    thumbnail: string;
    preview2d: string;
    preview3d: string;
  };

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'integer', default: 0 })
  viewCount: number;

  @ManyToOne(() => HomeProject, (project) => project.designs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: HomeProject;

  @Column()
  projectId: string;

  @CreateDateColumn()
  createdAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DreamHomeProject } from './dream-home-project.entity';

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

@Entity('dream_designs')
export class DreamDesign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column({ type: 'enum', enum: DesignStyle })
  style: DesignStyle;

  @Column('text', { nullable: true })
  description: string;

  @Column('simple-array')
  colorPalette: string[]; // Hex colors

  @Column('jsonb')
  materials: {
    exterior: string;
    roofing: string;
    flooring: string;
    walls: string;
    doors: string;
    windows: string;
    plumbing?: string;
    electrical?: string;
  };

  @Column('simple-array', { default: () => 'ARRAY[]::text[]' })
  features: string[];

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  estimatedCost: number;

  @Column('jsonb', { nullable: true })
  visualizationUrls: {
    thumbnail?: string;
    preview2d?: string;
    preview3d?: string;
  };

  @Column('boolean', { default: false })
  isPublished: boolean;

  @Column('integer', { default: 0 })
  viewCount: number;

  @Column('integer', { default: 0 })
  likeCount: number;

  @ManyToOne(() => DreamHomeProject, (project) => project.designs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: DreamHomeProject;

  @Column('uuid')
  projectId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

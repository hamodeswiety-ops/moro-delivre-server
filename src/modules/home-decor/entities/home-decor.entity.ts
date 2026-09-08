import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('home_decor_designs')
export class HomeDecorDesign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('jsonb', { default: {} })
  design: {
    roomType: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office';
    furniture: Array<{
      id: string;
      name: string;
      color: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      image: string;
    }>;
    walls: {
      color: string;
      pattern?: string;
    };
    floor: {
      color: string;
      material: string;
    };
    lighting: {
      brightness: number;
      color: string;
    };
    accessories: Array<{
      id: string;
      name: string;
      color: string;
      image: string;
      position: { x: number; y: number };
    }>;
  };

  @Column({ nullable: true })
  backgroundImage?: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  downloads: number;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('home_decor_furniture')
export class HomeDecorFurniture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: 'seating' | 'table' | 'storage' | 'lighting' | 'decoration';

  @Column('simple-array')
  colors: string[];

  @Column()
  image: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('home_decor_color_palettes')
export class HomeDecorColorPalette {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('simple-array')
  colors: string[];

  @Column()
  style: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}

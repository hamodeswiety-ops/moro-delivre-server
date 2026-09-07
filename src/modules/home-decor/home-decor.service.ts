import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeDecorDesign, HomeDecorFurniture, HomeDecorColorPalette } from './entities/home-decor.entity';
import { CreateDesignDto, UpdateDesignDto } from './dto/design.dto';

@Injectable()
export class HomeDecorService {
  constructor(
    @InjectRepository(HomeDecorDesign)
    private designRepository: Repository<HomeDecorDesign>,
    @InjectRepository(HomeDecorFurniture)
    private furnitureRepository: Repository<HomeDecorFurniture>,
    @InjectRepository(HomeDecorColorPalette)
    private paletteRepository: Repository<HomeDecorColorPalette>,
  ) {}

  // Design Methods
  async createDesign(dto: CreateDesignDto, userId: string): Promise<HomeDecorDesign> {
    const design = this.designRepository.create({
      ...dto,
      userId,
    });
    return this.designRepository.save(design);
  }

  async getDesigns(page = 1, limit = 12): Promise<{ data: HomeDecorDesign[]; total: number }> {
    const [data, total] = await this.designRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async getDesignById(id: string): Promise<HomeDecorDesign> {
    return this.designRepository.findOneBy({ id });
  }

  async updateDesign(id: string, dto: UpdateDesignDto): Promise<HomeDecorDesign> {
    await this.designRepository.update(id, dto);
    return this.getDesignById(id);
  }

  async deleteDesign(id: string): Promise<void> {
    await this.designRepository.delete(id);
  }

  async getDesignsByUser(userId: string): Promise<HomeDecorDesign[]> {
    return this.designRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  // Furniture Methods
  async getFurniture(category?: string, page = 1, limit = 12): Promise<{ data: HomeDecorFurniture[]; total: number }> {
    const query = this.furnitureRepository.createQueryBuilder('f');
    if (category) query.where('f.category = :category', { category });

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('f.rating', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async getFurnitureById(id: string): Promise<HomeDecorFurniture> {
    return this.furnitureRepository.findOneBy({ id });
  }

  async getFurnitureByCategory(category: string): Promise<HomeDecorFurniture[]> {
    return this.furnitureRepository.find({
      where: { category: category as any },
      order: { rating: 'DESC' }
    });
  }

  async createFurniture(dto: any): Promise<HomeDecorFurniture> {
    return this.furnitureRepository.save(dto);
  }

  // Color Palette Methods
  async getColorPalettes(): Promise<HomeDecorColorPalette[]> {
    return this.paletteRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getColorPaletteById(id: string): Promise<HomeDecorColorPalette> {
    return this.paletteRepository.findOneBy({ id });
  }

  async createColorPalette(dto: any): Promise<HomeDecorColorPalette> {
    return this.paletteRepository.save(dto);
  }

  async searchDesigns(keyword: string): Promise<HomeDecorDesign[]> {
    return this.designRepository
      .createQueryBuilder('d')
      .where('d.name ILIKE :keyword OR d.description ILIKE :keyword', { keyword: `%${keyword}%` })
      .orderBy('d.createdAt', 'DESC')
      .take(20)
      .getMany();
  }

  async rateDesign(designId: string, rating: number): Promise<HomeDecorDesign> {
    const design = await this.getDesignById(designId);
    const newRating = (design.rating * design.downloads + rating) / (design.downloads + 1);
    design.downloads += 1;
    design.rating = newRating;
    return this.designRepository.save(design);
  }
}

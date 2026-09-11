import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Material, MaterialCategory } from '../entities/material.entity';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialsRepo: Repository<Material>,
  ) {}

  async findAll(category?: MaterialCategory, limit: number = 50): Promise<Material[]> {
    const query = this.materialsRepo.createQueryBuilder('m')
      .where('m.isAvailable = :available', { available: true });

    if (category) {
      query.andWhere('m.category = :category', { category });
    }

    return query
      .orderBy('m.rating', 'DESC')
      .take(limit)
      .getMany();
  }

  async search(query: string, limit: number = 20): Promise<Material[]> {
    return this.materialsRepo.find({
      where: [
        { name: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
        { tags: Like(`%${query}%`) },
      ],
      take: limit,
    });
  }

  async findByPrice(minPrice: number, maxPrice: number): Promise<Material[]> {
    return this.materialsRepo.find({
      where: {
        unitPrice: Between(minPrice, maxPrice),
        isAvailable: true,
      },
      order: { unitPrice: 'ASC' },
    });
  }

  async getEcoFriendly(limit: number = 50): Promise<Material[]> {
    return this.materialsRepo.find({
      where: {
        isEcoFriendly: true,
        isAvailable: true,
      },
      order: { rating: 'DESC' },
      take: limit,
    });
  }

  async getByCategory(category: MaterialCategory): Promise<Material[]> {
    return this.materialsRepo.find({
      where: { category, isAvailable: true },
      order: { rating: 'DESC' },
    });
  }

  async getRecommended(category: MaterialCategory, budget: number): Promise<Material[]> {
    return this.materialsRepo.find({
      where: {
        category,
        unitPrice: Between(0, budget),
        isAvailable: true,
      },
      order: { rating: 'DESC' },
      take: 5,
    });
  }

  async calculateBulkCost(
    materials: Array<{ materialId: string; quantity: number }>,
  ): Promise<number> {
    let totalCost = 0;

    for (const item of materials) {
      const material = await this.materialsRepo.findOne({
        where: { id: item.materialId },
      });

      if (material) {
        totalCost += material.unitPrice * item.quantity;
      }
    }

    return totalCost;
  }

  async getTopRated(limit: number = 10): Promise<Material[]> {
    return this.materialsRepo.find({
      where: { isAvailable: true },
      order: { rating: 'DESC', reviews: 'DESC' },
      take: limit,
    });
  }

  async getByColor(color: string): Promise<Material[]> {
    return this.materialsRepo.find({
      where: { color, isAvailable: true },
    });
  }
}

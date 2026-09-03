import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: any, storeId: string) {
    const product = this.productsRepository.create({
      ...createProductDto,
      store: { id: storeId },
    });
    return this.productsRepository.save(product);
  }

  async findAll(storeId?: string) {
    const query = this.productsRepository.createQueryBuilder('product');

    if (storeId) {
      query.where('product.storeId = :storeId', { storeId });
    }

    return query
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async findById(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['store'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: any) {
    await this.findById(id);
    await this.productsRepository.update(id, updateProductDto);
    return this.findById(id);
  }

  async remove(id: string) {
    const product = await this.findById(id);
    product.isActive = false;
    return this.productsRepository.save(product);
  }
}

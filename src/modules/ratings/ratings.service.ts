import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingEntity } from './entities/rating.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { ProductEntity } from '../products/entities/product.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(RatingEntity)
    private ratingsRepository: Repository<RatingEntity>,
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
  ) {}

  async createRating(
    orderId: string,
    productId: string,
    rating: number,
    comment?: string,
    customerEmail?: string,
    customerName?: string,
  ) {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingRating = await this.ratingsRepository.findOne({
      where: {
        orderId,
        productId,
      },
    });

    if (existingRating) {
      throw new BadRequestException('Rating already exists for this product and order');
    }

    const newRating = this.ratingsRepository.create({
      rating,
      comment,
      customerEmail: customerEmail || order.customerEmail,
      customerName: customerName || order.customerName,
      order,
      product,
    });

    await this.ratingsRepository.save(newRating);

    return newRating;
  }

  async getRatingsByProduct(productId: string, limit: number = 10, offset: number = 0) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const [ratings, total] = await this.ratingsRepository.findAndCount({
      where: { productId },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    return {
      ratings,
      total,
      hasMore: offset + limit < total,
    };
  }

  async getRatingsByOrder(orderId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.ratingsRepository.find({
      where: { orderId },
      relations: ['product'],
    });
  }

  async getProductAverageRating(productId: string) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const result = await this.ratingsRepository
      .createQueryBuilder('rating')
      .where('rating.productId = :productId', { productId })
      .select('AVG(rating.rating)', 'average')
      .addSelect('COUNT(*)', 'count')
      .getRawOne();

    return {
      productId,
      averageRating: result?.average ? parseFloat(result.average).toFixed(2) : 0,
      totalRatings: parseInt(result?.count || '0'),
    };
  }

  async updateRating(ratingId: string, rating?: number, comment?: string) {
    const existingRating = await this.ratingsRepository.findOne({
      where: { id: ratingId },
    });

    if (!existingRating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }
      existingRating.rating = rating;
    }

    if (comment !== undefined) {
      existingRating.comment = comment;
    }

    await this.ratingsRepository.save(existingRating);

    return existingRating;
  }

  async deleteRating(ratingId: string) {
    const rating = await this.ratingsRepository.findOne({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    await this.ratingsRepository.remove(rating);

    return { message: 'Rating deleted successfully' };
  }

  async getTopRatedProducts(limit: number = 10) {
    const products = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('rating.productId', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('AVG(rating.rating)', 'averageRating')
      .addSelect('COUNT(*)', 'totalRatings')
      .leftJoin('rating.product', 'product')
      .groupBy('rating.productId, product.name')
      .orderBy('averageRating', 'DESC')
      .limit(limit)
      .getRawMany();

    return products.map((p) => ({
      productId: p.productId,
      productName: p.productName,
      averageRating: parseFloat(p.averageRating).toFixed(2),
      totalRatings: parseInt(p.totalRatings),
    }));
  }

  async getRatingDistribution(productId: string) {
    const distribution = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('rating.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .where('rating.productId = :productId', { productId })
      .groupBy('rating.rating')
      .orderBy('rating.rating', 'ASC')
      .getRawMany();

    const result = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    distribution.forEach((d) => {
      result[d.rating] = parseInt(d.count);
    });

    return result;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, In } from 'typeorm';
import { ProductEntity } from '../products/entities/product.entity';
import { StoreEntity } from '../stores/entities/store.entity';
import { RatingEntity } from '../ratings/entities/rating.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    @InjectRepository(StoreEntity)
    private storesRepository: Repository<StoreEntity>,
    @InjectRepository(RatingEntity)
    private ratingsRepository: Repository<RatingEntity>,
  ) {}

  async searchProducts(
    query: string,
    limit: number = 20,
    offset: number = 0,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
    storeId?: string,
    sortBy?: string,
  ) {
    let queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.store', 'store')
      .where('product.isActive = :isActive', { isActive: true });

    if (query) {
      queryBuilder = queryBuilder.andWhere(
        '(product.name ILIKE :query OR product.description ILIKE :query)',
        { query: `%${query}%` },
      );
    }

    if (storeId) {
      queryBuilder = queryBuilder.andWhere('product.storeId = :storeId', { storeId });
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      queryBuilder = queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    } else if (minPrice !== undefined) {
      queryBuilder = queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    } else if (maxPrice !== undefined) {
      queryBuilder = queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const products = await queryBuilder.skip(offset).take(limit).getMany();

    const total = await queryBuilder.getCount();

    let filteredProducts = products;

    if (minRating !== undefined && minRating > 0) {
      const ratingsMap = new Map<string, { count: number; sum: number }>();

      for (const product of products) {
        const ratings = await this.ratingsRepository.find({
          where: { productId: product.id },
        });

        if (ratings.length > 0) {
          const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
          const avg = sum / ratings.length;
          if (avg >= minRating) {
            ratingsMap.set(product.id, { count: ratings.length, sum });
          }
        }
      }

      filteredProducts = products.filter((p) => ratingsMap.has(p.id));
    }

    if (sortBy) {
      filteredProducts.sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return parseFloat(a.price.toString()) - parseFloat(b.price.toString());
          case 'price_desc':
            return parseFloat(b.price.toString()) - parseFloat(a.price.toString());
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });
    }

    const productsWithRatings = await Promise.all(
      filteredProducts.map(async (product) => {
        const ratings = await this.ratingsRepository.find({
          where: { productId: product.id },
        });
        const averageRating =
          ratings.length > 0 ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(2) : '0';

        return {
          ...product,
          averageRating,
          totalRatings: ratings.length,
        };
      }),
    );

    return {
      products: productsWithRatings,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async searchStores(
    query: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    const [stores, total] = await this.storesRepository.findAndCount({
      where: {
        name: ILike(`%${query}%`),
      },
      skip: offset,
      take: limit,
    });

    return {
      stores,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async getFilters() {
    const products = await this.productsRepository.find({
      where: { isActive: true },
    });

    const minPrice = Math.min(...products.map((p) => parseFloat(p.price.toString())));
    const maxPrice = Math.max(...products.map((p) => parseFloat(p.price.toString())));

    const stores = await this.storesRepository.find();

    const ratings = await this.ratingsRepository.find();
    const minRating = ratings.length > 0 ? Math.min(...ratings.map((r) => r.rating)) : 1;
    const maxRating = ratings.length > 0 ? Math.max(...ratings.map((r) => r.rating)) : 5;

    return {
      priceRange: {
        min: parseFloat(minPrice.toFixed(2)),
        max: parseFloat(maxPrice.toFixed(2)),
      },
      stores: stores.map((s) => ({
        id: s.id,
        name: s.name,
      })),
      ratingRange: {
        min: minRating,
        max: maxRating,
      },
      sortOptions: [
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest First' },
        { value: 'rating', label: 'Highest Rated' },
      ],
    };
  }

  async getProductsByStore(storeId: string, limit: number = 20, offset: number = 0) {
    const [products, total] = await this.productsRepository.findAndCount({
      where: { store: { id: storeId }, isActive: true },
      skip: offset,
      take: limit,
      relations: ['store'],
    });

    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const ratings = await this.ratingsRepository.find({
          where: { productId: product.id },
        });
        const averageRating =
          ratings.length > 0 ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(2) : '0';

        return {
          ...product,
          averageRating,
          totalRatings: ratings.length,
        };
      }),
    );

    return {
      products: productsWithRatings,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async getRelatedProducts(productId: string, limit: number = 5) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['store'],
    });

    if (!product) {
      return { products: [] };
    }

    const relatedProducts = await this.productsRepository.find({
      where: {
        store: { id: product.store.id },
        isActive: true,
      },
      take: limit + 1,
    });

    const filtered = relatedProducts.filter((p) => p.id !== productId).slice(0, limit);

    const productsWithRatings = await Promise.all(
      filtered.map(async (prod) => {
        const ratings = await this.ratingsRepository.find({
          where: { productId: prod.id },
        });
        const averageRating =
          ratings.length > 0 ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(2) : '0';

        return {
          ...prod,
          averageRating,
          totalRatings: ratings.length,
        };
      }),
    );

    return {
      products: productsWithRatings,
    };
  }

  async getProductSuggestions(query: string, limit: number = 5) {
    if (!query || query.length < 2) {
      return { suggestions: [] };
    }

    const products = await this.productsRepository.find({
      where: {
        name: ILike(`%${query}%`),
        isActive: true,
      },
      take: limit,
    });

    return {
      suggestions: products.map((p) => ({
        id: p.id,
        name: p.name,
        type: 'product',
      })),
    };
  }

  async getTrendingProducts(limit: number = 10) {
    const ratings = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('rating.productId', 'productId')
      .addSelect('COUNT(*)', 'ratingCount')
      .groupBy('rating.productId')
      .orderBy('ratingCount', 'DESC')
      .limit(limit)
      .getRawMany();

    const productIds = ratings.map((r) => r.productId);

    if (productIds.length === 0) {
      return { products: [] };
    }

    const products = await this.productsRepository.find({
      where: { id: In(productIds) },
      relations: ['store'],
    });

    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const prodRatings = await this.ratingsRepository.find({
          where: { productId: product.id },
        });
        const averageRating =
          prodRatings.length > 0
            ? (prodRatings.reduce((acc, r) => acc + r.rating, 0) / prodRatings.length).toFixed(2)
            : '0';

        return {
          ...product,
          averageRating,
          totalRatings: prodRatings.length,
        };
      }),
    );

    return {
      products: productsWithRatings.sort((a, b) => b.totalRatings - a.totalRatings),
    };
  }
}

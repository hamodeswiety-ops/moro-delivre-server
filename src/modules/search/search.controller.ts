import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('products')
  @ApiOperation({ summary: 'Search products' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price' })
  @ApiQuery({ name: 'minRating', required: false, description: 'Minimum rating' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort option: price_asc, price_desc, newest, rating',
  })
  async searchProducts(
    @Query('query') query?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minRating') minRating?: string,
    @Query('storeId') storeId?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.searchService.searchProducts(
      query || '',
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
      minRating ? parseFloat(minRating) : undefined,
      storeId,
      sortBy,
    );
  }

  @Get('stores')
  @ApiOperation({ summary: 'Search stores' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination' })
  async searchStores(
    @Query('query') query?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.searchService.searchStores(query || '', limit ? parseInt(limit) : 20, offset ? parseInt(offset) : 0);
  }

  @Get('filters')
  @ApiOperation({ summary: 'Get available filter options' })
  async getFilters() {
    return this.searchService.getFilters();
  }

  @Get('store/:storeId/products')
  @ApiOperation({ summary: 'Get products by store' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination' })
  async getProductsByStore(
    @Query('storeId') storeId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.searchService.getProductsByStore(storeId, limit ? parseInt(limit) : 20, offset ? parseInt(offset) : 0);
  }

  @Get('product/:productId/related')
  @ApiOperation({ summary: 'Get related products' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results' })
  async getRelatedProducts(@Query('productId') productId: string, @Query('limit') limit?: string) {
    return this.searchService.getRelatedProducts(productId, limit ? parseInt(limit) : 5);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get product suggestions' })
  @ApiQuery({ name: 'query', required: true, description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results' })
  async getProductSuggestions(@Query('query') query: string, @Query('limit') limit?: string) {
    return this.searchService.getProductSuggestions(query, limit ? parseInt(limit) : 5);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending products' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results' })
  async getTrendingProducts(@Query('limit') limit?: string) {
    return this.searchService.getTrendingProducts(limit ? parseInt(limit) : 10);
  }
}

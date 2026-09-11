import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MaterialsService } from '../services/materials.service';
import { MaterialCategory } from '../entities/material.entity';

@ApiTags('Materials')
@Controller('api/v1/materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all materials' })
  async findAll(
    @Query('category') category?: MaterialCategory,
    @Query('limit') limit: number = 50,
  ) {
    return this.materialsService.findAll(category, limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search materials' })
  async search(@Query('q') query: string, @Query('limit') limit: number = 20) {
    return this.materialsService.search(query, limit);
  }

  @Get('eco-friendly')
  @ApiOperation({ summary: 'Get eco-friendly materials' })
  async getEcoFriendly(@Query('limit') limit: number = 50) {
    return this.materialsService.getEcoFriendly(limit);
  }

  @Get('price-range')
  @ApiOperation({ summary: 'Get materials by price range' })
  async findByPrice(
    @Query('min') min: number,
    @Query('max') max: number,
  ) {
    return this.materialsService.findByPrice(min, max);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get materials by category' })
  async getByCategory(@Param('category') category: MaterialCategory) {
    return this.materialsService.getByCategory(category);
  }

  @Get('recommended/:category')
  @ApiOperation({ summary: 'Get recommended materials' })
  async getRecommended(
    @Param('category') category: MaterialCategory,
    @Query('budget') budget: number,
  ) {
    return this.materialsService.getRecommended(category, budget);
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Get top rated materials' })
  async getTopRated(@Query('limit') limit: number = 10) {
    return this.materialsService.getTopRated(limit);
  }

  @Get('color/:color')
  @ApiOperation({ summary: 'Get materials by color' })
  async getByColor(@Param('color') color: string) {
    return this.materialsService.getByColor(color);
  }

  @Get('bulk-cost')
  @ApiOperation({ summary: 'Calculate bulk material cost' })
  async calculateBulkCost(
    @Query() materials: Array<{ materialId: string; quantity: number }>,
  ) {
    const cost = await this.materialsService.calculateBulkCost(materials);
    return { totalCost: cost };
  }
}

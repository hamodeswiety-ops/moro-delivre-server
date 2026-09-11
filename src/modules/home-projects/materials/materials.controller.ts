import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MaterialsService } from './materials.service';

@ApiTags('Materials & Colors')
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all materials or filter by category' })
  getMaterials(@Query('category') category?: string) {
    return this.materialsService.getMaterials(category);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search materials' })
  searchMaterials(@Query('q') query: string) {
    return this.materialsService.searchMaterials(query);
  }

  @Get('eco-friendly')
  @ApiOperation({ summary: 'Get eco-friendly materials' })
  getEcoFriendlyMaterials() {
    return this.materialsService.getEcoFriendlyMaterials();
  }

  @Get('budget')
  @ApiOperation({ summary: 'Get materials by max budget' })
  getMaterialsByBudget(@Query('maxPrice') maxPrice: number) {
    return this.materialsService.getMaterialsByBudget(maxPrice);
  }

  @Get('recommended')
  @ApiOperation({ summary: 'Get recommended materials by style' })
  getRecommendedMaterials(@Query('style') style: string) {
    return this.materialsService.getRecommendedMaterials(style);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material by ID' })
  getMaterialById(@Param('id') id: string) {
    return this.materialsService.getMaterialById(id);
  }

  @Get('calculate-cost')
  @ApiOperation({ summary: 'Calculate total cost for materials' })
  calculateCost(@Body() body: { materials: { materialId: string; quantity: number }[] }) {
    const totalCost = this.materialsService.calculateMaterialCost(body.materials);
    return { totalCost };
  }

  @Get('colors')
  @ApiOperation({ summary: 'Get all color options' })
  getColors() {
    return this.materialsService.getColors();
  }

  @Get('colors/category/:category')
  @ApiOperation({ summary: 'Get colors by category' })
  getColorsByCategory(@Param('category') category: string) {
    return this.materialsService.getColorsByCategory(category);
  }

  @Get('colors/:id')
  @ApiOperation({ summary: 'Get color by ID' })
  getColorById(@Param('id') id: string) {
    return this.materialsService.getColorById(id);
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HomeDecorService } from './home-decor.service';
import { CreateDesignDto, UpdateDesignDto, RateDesignDto } from './dto/design.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Home Decor')
@Controller('api/home-decor')
export class HomeDecorController {
  constructor(private readonly homeDecorService: HomeDecorService) {}

  // Design Endpoints
  @Get('designs')
  async getDesigns(@Query('page') page = 1, @Query('limit') limit = 12) {
    return this.homeDecorService.getDesigns(page, limit);
  }

  @Get('designs/search')
  async searchDesigns(@Query('q') keyword: string) {
    return this.homeDecorService.searchDesigns(keyword);
  }

  @Get('designs/:id')
  async getDesignById(@Param('id') id: string) {
    return this.homeDecorService.getDesignById(id);
  }

  @Post('designs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createDesign(@Body() dto: CreateDesignDto, @Req() req: any) {
    return this.homeDecorService.createDesign(dto, req.user.id);
  }

  @Put('designs/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateDesign(@Param('id') id: string, @Body() dto: UpdateDesignDto) {
    return this.homeDecorService.updateDesign(id, dto);
  }

  @Delete('designs/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteDesign(@Param('id') id: string) {
    await this.homeDecorService.deleteDesign(id);
    return { message: 'Design deleted successfully' };
  }

  @Get('my-designs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyDesigns(@Req() req: any) {
    return this.homeDecorService.getDesignsByUser(req.user.id);
  }

  @Post('designs/:id/rate')
  async rateDesign(@Param('id') id: string, @Body() dto: RateDesignDto) {
    return this.homeDecorService.rateDesign(id, dto.rating);
  }

  // Furniture Endpoints
  @Get('furniture')
  async getFurniture(@Query('category') category?: string, @Query('page') page = 1, @Query('limit') limit = 12) {
    return this.homeDecorService.getFurniture(category, page, limit);
  }

  @Get('furniture/:id')
  async getFurnitureById(@Param('id') id: string) {
    return this.homeDecorService.getFurnitureById(id);
  }

  @Get('furniture/category/:category')
  async getFurnitureByCategory(@Param('category') category: string) {
    return this.homeDecorService.getFurnitureByCategory(category);
  }

  @Post('furniture')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createFurniture(@Body() dto: any) {
    return this.homeDecorService.createFurniture(dto);
  }

  // Color Palette Endpoints
  @Get('color-palettes')
  async getColorPalettes() {
    return this.homeDecorService.getColorPalettes();
  }

  @Get('color-palettes/:id')
  async getColorPaletteById(@Param('id') id: string) {
    return this.homeDecorService.getColorPaletteById(id);
  }

  @Post('color-palettes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createColorPalette(@Body() dto: any) {
    return this.homeDecorService.createColorPalette(dto);
  }
}

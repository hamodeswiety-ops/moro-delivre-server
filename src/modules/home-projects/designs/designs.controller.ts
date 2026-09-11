import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DesignsService } from './designs.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { DesignStyle } from '../entities/project-design.entity';

@ApiTags('Home Designs')
@Controller('home-projects/:projectId/designs')
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new design' })
  async createDesign(
    @Param('projectId') projectId: string,
    @Body() createDesignDto: CreateDesignDto,
  ) {
    return this.designsService.createDesign(projectId, createDesignDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all designs for a project' })
  async getProjectDesigns(@Param('projectId') projectId: string) {
    return this.designsService.getProjectDesigns(projectId);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular designs' })
  async getPopularDesigns(@Query('limit') limit: number = 10) {
    return this.designsService.getPopularDesigns(limit);
  }

  @Get('style/:style')
  @ApiOperation({ summary: 'Get designs by style' })
  async getDesignsByStyle(@Param('style') style: DesignStyle) {
    return this.designsService.getDesignsByStyle(style);
  }

  @Get(':designId')
  @ApiOperation({ summary: 'Get design by ID' })
  async getDesign(@Param('designId') designId: string) {
    const design = await this.designsService.getDesign(designId);
    await this.designsService.incrementViewCount(designId);
    return design;
  }

  @Patch(':designId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update design' })
  async updateDesign(
    @Param('designId') designId: string,
    @Body() updateData: Partial<CreateDesignDto>,
  ) {
    return this.designsService.updateDesign(designId, updateData);
  }

  @Patch(':designId/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish design' })
  async publishDesign(@Param('designId') designId: string) {
    return this.designsService.publishDesign(designId);
  }

  @Delete(':designId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete design' })
  async deleteDesign(@Param('designId') designId: string) {
    return this.designsService.deleteDesign(designId);
  }
}

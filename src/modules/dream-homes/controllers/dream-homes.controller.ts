import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DreamHomesService } from '../services/dream-homes.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectStatus } from '../entities/dream-home-project.entity';

@ApiTags('Dream Home Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/dream-projects')
export class DreamHomesController {
  constructor(private readonly dreamHomesService: DreamHomesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new dream home project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async create(@Body() createDto: CreateProjectDto, @Request() req) {
    return this.dreamHomesService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  async findAll(@Request() req, @Query('status') status?: ProjectStatus) {
    return this.dreamHomesService.findAll(req.user.id, status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get project statistics' })
  async getStats(@Request() req) {
    return this.dreamHomesService.getStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.dreamHomesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateProjectDto>,
    @Request() req,
  ) {
    return this.dreamHomesService.update(id, req.user.id, updateDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update project status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ProjectStatus,
    @Request() req,
  ) {
    return this.dreamHomesService.updateStatus(id, req.user.id, status);
  }

  @Patch(':id/cost')
  @ApiOperation({ summary: 'Update actual cost' })
  async updateCost(
    @Param('id') id: string,
    @Body('actualCost') actualCost: number,
    @Request() req,
  ) {
    return this.dreamHomesService.updateCost(id, req.user.id, actualCost);
  }

  @Get(':id/cost')
  @ApiOperation({ summary: 'Calculate total cost' })
  async calculateCost(@Param('id') id: string, @Request() req) {
    const cost = await this.dreamHomesService.calculateCost(id, req.user.id);
    return { totalCost: cost };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete project (soft delete)' })
  async delete(@Param('id') id: string, @Request() req) {
    await this.dreamHomesService.delete(id, req.user.id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore deleted project' })
  async restore(@Param('id') id: string, @Request() req) {
    return this.dreamHomesService.restore(id, req.user.id);
  }
}

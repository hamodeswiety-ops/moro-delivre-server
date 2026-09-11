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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HomeProjectsService } from './home-projects.service';
import { CreateHomeProjectDto } from './dto/create-home-project.dto';
import { UpdateHomeProjectDto } from './dto/update-home-project.dto';
import { ProjectStatus } from './entities/home-project.entity';

@ApiTags('Home Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('home-projects')
export class HomeProjectsController {
  constructor(private readonly homeProjectsService: HomeProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new home project' })
  async create(
    @Body() createHomeProjectDto: CreateHomeProjectDto,
    @Request() req,
  ) {
    return this.homeProjectsService.create(
      createHomeProjectDto,
      req.user.id,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects for user' })
  async findAll(@Request() req) {
    return this.homeProjectsService.findAll(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user project statistics' })
  async getStats(@Request() req) {
    return this.homeProjectsService.getProjectStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.homeProjectsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project details' })
  async update(
    @Param('id') id: string,
    @Body() updateHomeProjectDto: UpdateHomeProjectDto,
    @Request() req,
  ) {
    return this.homeProjectsService.update(
      id,
      updateHomeProjectDto,
      req.user.id,
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update project status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ProjectStatus },
    @Request() req,
  ) {
    return this.homeProjectsService.updateStatus(id, body.status, req.user.id);
  }

  @Patch(':id/cost')
  @ApiOperation({ summary: 'Update project cost' })
  async updateCost(
    @Param('id') id: string,
    @Body() body: { currentCost: number },
    @Request() req,
  ) {
    return this.homeProjectsService.updateCost(
      id,
      body.currentCost,
      req.user.id,
    );
  }

  @Get(':id/cost/calculate')
  @ApiOperation({ summary: 'Calculate total project cost' })
  async calculateCost(@Param('id') id: string, @Request() req) {
    const totalCost = await this.homeProjectsService.calculateProjectCost(
      id,
      req.user.id,
    );
    return { totalCost };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete project' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.homeProjectsService.delete(id, req.user.id);
  }
}

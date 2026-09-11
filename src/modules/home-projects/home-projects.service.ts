import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeProject, ProjectStatus } from './entities/home-project.entity';
import { CreateHomeProjectDto } from './dto/create-home-project.dto';
import { UpdateHomeProjectDto } from './dto/update-home-project.dto';

@Injectable()
export class HomeProjectsService {
  constructor(
    @InjectRepository(HomeProject)
    private homeProjectRepository: Repository<HomeProject>,
  ) {}

  async create(
    createHomeProjectDto: CreateHomeProjectDto,
    userId: string,
  ): Promise<HomeProject> {
    const project = this.homeProjectRepository.create({
      ...createHomeProjectDto,
      userId,
    });
    return this.homeProjectRepository.save(project);
  }

  async findAll(userId: string): Promise<HomeProject[]> {
    return this.homeProjectRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<HomeProject> {
    const project = await this.homeProjectRepository.findOne({
      where: { id, userId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(
    id: string,
    updateHomeProjectDto: UpdateHomeProjectDto,
    userId: string,
  ): Promise<HomeProject> {
    const project = await this.findOne(id, userId);
    Object.assign(project, updateHomeProjectDto);
    return this.homeProjectRepository.save(project);
  }

  async updateStatus(
    id: string,
    status: ProjectStatus,
    userId: string,
  ): Promise<HomeProject> {
    const project = await this.findOne(id, userId);
    project.status = status;
    return this.homeProjectRepository.save(project);
  }

  async updateCost(
    id: string,
    currentCost: number,
    userId: string,
  ): Promise<HomeProject> {
    const project = await this.findOne(id, userId);
    if (currentCost > project.estimatedBudget * 1.2) {
      throw new BadRequestException(
        'Current cost exceeds 20% of estimated budget',
      );
    }
    project.currentCost = currentCost;
    return this.homeProjectRepository.save(project);
  }

  async delete(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    await this.homeProjectRepository.remove(project);
  }

  async calculateProjectCost(id: string, userId: string): Promise<number> {
    const project = await this.findOne(id, userId);
    let totalCost = 0;

    if (project.floors && project.floors.length > 0) {
      for (const floor of project.floors) {
        if (floor.rooms && floor.rooms.length > 0) {
          for (const room of floor.rooms) {
            totalCost += room.estimatedCost || 0;
          }
        }
      }
    }

    if (project.designs && project.designs.length > 0) {
      totalCost += project.designs.reduce((sum, design) => sum + design.totalCost, 0);
    }

    return totalCost;
  }

  async getProjectStats(userId: string) {
    const projects = await this.findAll(userId);
    return {
      totalProjects: projects.length,
      draftProjects: projects.filter((p) => p.status === ProjectStatus.DRAFT)
        .length,
      inProgressProjects: projects.filter(
        (p) => p.status === ProjectStatus.IN_PROGRESS,
      ).length,
      completedProjects: projects.filter(
        (p) => p.status === ProjectStatus.COMPLETED,
      ).length,
      totalInvestment: projects.reduce((sum, p) => sum + p.estimatedBudget, 0),
      totalSpent: projects.reduce((sum, p) => sum + p.currentCost, 0),
    };
  }
}

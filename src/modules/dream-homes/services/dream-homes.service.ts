import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DreamHomeProject, ProjectStatus } from '../entities/dream-home-project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';

@Injectable()
export class DreamHomesService {
  constructor(
    @InjectRepository(DreamHomeProject)
    private projectsRepo: Repository<DreamHomeProject>,
  ) {}

  async create(createDto: CreateProjectDto, userId: string): Promise<DreamHomeProject> {
    const project = this.projectsRepo.create({
      ...createDto,
      userId,
    });
    return this.projectsRepo.save(project);
  }

  async findAll(userId: string, status?: ProjectStatus): Promise<DreamHomeProject[]> {
    const query = this.projectsRepo.createQueryBuilder('p')
      .where('p.userId = :userId', { userId })
      .where('p.deletedAt IS NULL');

    if (status) {
      query.andWhere('p.status = :status', { status });
    }

    return query.orderBy('p.createdAt', 'DESC').getMany();
  }

  async findOne(id: string, userId: string): Promise<DreamHomeProject> {
    const project = await this.projectsRepo.findOne({
      where: { id, userId, deletedAt: null },
      relations: ['designs', 'floors'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: string, userId: string, updateDto: Partial<CreateProjectDto>): Promise<DreamHomeProject> {
    const project = await this.findOne(id, userId);
    Object.assign(project, updateDto);
    return this.projectsRepo.save(project);
  }

  async updateStatus(id: string, userId: string, status: ProjectStatus): Promise<DreamHomeProject> {
    const project = await this.findOne(id, userId);
    project.status = status;
    return this.projectsRepo.save(project);
  }

  async updateCost(id: string, userId: string, actualCost: number): Promise<DreamHomeProject> {
    const project = await this.findOne(id, userId);

    if (actualCost > project.estimatedBudget * 1.5) {
      throw new BadRequestException('Cost exceeds 150% of estimated budget');
    }

    project.actualCost = actualCost;
    return this.projectsRepo.save(project);
  }

  async calculateCost(id: string, userId: string): Promise<number> {
    const project = await this.findOne(id, userId);

    let totalCost = 0;

    if (project.floors && project.floors.length > 0) {
      for (const floor of project.floors) {
        totalCost += floor.estimatedCost || 0;
      }
    }

    if (project.designs && project.designs.length > 0) {
      totalCost = Math.max(
        totalCost,
        Math.max(...project.designs.map(d => d.estimatedCost)),
      );
    }

    return totalCost;
  }

  async getStats(userId: string) {
    const projects = await this.findAll(userId);

    return {
      total: projects.length,
      byStatus: {
        draft: projects.filter(p => p.status === ProjectStatus.DRAFT).length,
        designing: projects.filter(p => p.status === ProjectStatus.DESIGNING).length,
        estimating: projects.filter(p => p.status === ProjectStatus.ESTIMATING).length,
        reviewing: projects.filter(p => p.status === ProjectStatus.REVIEWING).length,
        approved: projects.filter(p => p.status === ProjectStatus.APPROVED).length,
        building: projects.filter(p => p.status === ProjectStatus.BUILDING).length,
        completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
      },
      totalBudget: projects.reduce((sum, p) => sum + p.estimatedBudget, 0),
      totalSpent: projects.reduce((sum, p) => sum + p.actualCost, 0),
      averageBudget: projects.length ? projects.reduce((sum, p) => sum + p.estimatedBudget, 0) / projects.length : 0,
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    project.deletedAt = new Date();
    await this.projectsRepo.save(project);
  }

  async restore(id: string, userId: string): Promise<DreamHomeProject> {
    const project = await this.projectsRepo.findOne({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.deletedAt = null;
    return this.projectsRepo.save(project);
  }
}

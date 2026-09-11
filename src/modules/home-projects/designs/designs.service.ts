import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectDesign, DesignStyle } from '../entities/project-design.entity';
import { CreateDesignDto } from './dto/create-design.dto';

@Injectable()
export class DesignsService {
  constructor(
    @InjectRepository(ProjectDesign)
    private designRepository: Repository<ProjectDesign>,
  ) {}

  async createDesign(
    projectId: string,
    createDesignDto: CreateDesignDto,
  ): Promise<ProjectDesign> {
    const design = this.designRepository.create({
      ...createDesignDto,
      projectId,
    });
    return this.designRepository.save(design);
  }

  async getProjectDesigns(projectId: string): Promise<ProjectDesign[]> {
    return this.designRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });
  }

  async getDesign(id: string): Promise<ProjectDesign> {
    const design = await this.designRepository.findOne({ where: { id } });
    if (!design) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }
    return design;
  }

  async updateDesign(
    id: string,
    updateData: Partial<ProjectDesign>,
  ): Promise<ProjectDesign> {
    const design = await this.getDesign(id);
    Object.assign(design, updateData);
    return this.designRepository.save(design);
  }

  async publishDesign(id: string): Promise<ProjectDesign> {
    const design = await this.getDesign(id);
    design.isPublished = true;
    return this.designRepository.save(design);
  }

  async deleteDesign(id: string): Promise<void> {
    const design = await this.getDesign(id);
    await this.designRepository.remove(design);
  }

  async getDesignsByStyle(style: DesignStyle): Promise<ProjectDesign[]> {
    return this.designRepository.find({
      where: { style, isPublished: true },
      order: { viewCount: 'DESC' },
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.designRepository.increment({ id }, 'viewCount', 1);
  }

  async getPopularDesigns(limit: number = 10): Promise<ProjectDesign[]> {
    return this.designRepository.find({
      where: { isPublished: true },
      order: { viewCount: 'DESC' },
      take: limit,
    });
  }
}

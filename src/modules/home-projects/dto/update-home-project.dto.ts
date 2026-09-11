import { PartialType } from '@nestjs/swagger';
import { CreateHomeProjectDto } from './create-home-project.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '../entities/home-project.entity';

export class UpdateHomeProjectDto extends PartialType(
  CreateHomeProjectDto,
) {
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  currentCost?: number;
}

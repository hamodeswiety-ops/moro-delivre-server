import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeProject } from './entities/home-project.entity';
import { ProjectFloor } from './entities/project-floor.entity';
import { ProjectRoom } from './entities/project-room.entity';
import { ProjectDesign } from './entities/project-design.entity';
import { HomeProjectsService } from './home-projects.service';
import { HomeProjectsController } from './home-projects.controller';
import { DesignsService } from './designs/designs.service';
import { DesignsController } from './designs/designs.controller';
import { MaterialsService } from './materials/materials.service';
import { MaterialsController } from './materials/materials.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HomeProject,
      ProjectFloor,
      ProjectRoom,
      ProjectDesign,
    ]),
  ],
  providers: [HomeProjectsService, DesignsService, MaterialsService],
  controllers: [HomeProjectsController, DesignsController, MaterialsController],
  exports: [HomeProjectsService],
})
export class HomeProjectsModule {}

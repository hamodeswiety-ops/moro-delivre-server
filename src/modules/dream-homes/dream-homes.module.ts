import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DreamHomeProject } from './entities/dream-home-project.entity';
import { DreamDesign } from './entities/dream-design.entity';
import { ProjectFloor } from './entities/project-floor.entity';
import { ProjectRoom } from './entities/project-room.entity';
import { Material } from './entities/material.entity';
import { Payment } from './entities/payment.entity';
import { DreamHomesService } from './services/dream-homes.service';
import { DreamHomesController } from './controllers/dream-homes.controller';
import { MaterialsService } from './services/materials.service';
import { MaterialsController } from './controllers/materials.controller';
import { PricingService } from './services/pricing.service';
import { PricingController } from './controllers/pricing.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DreamHomeProject,
      DreamDesign,
      ProjectFloor,
      ProjectRoom,
      Material,
      Payment,
    ]),
  ],
  providers: [DreamHomesService, MaterialsService, PricingService],
  controllers: [DreamHomesController, MaterialsController, PricingController],
  exports: [DreamHomesService, MaterialsService, PricingService],
})
export class DreamHomesModule {}

import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeDecorController } from './home-decor.controller';
import { HomeDecorService } from './home-decor.service';
import { HomeDecorSeeder } from './home-decor.seed';
import { HomeDecorDesign, HomeDecorFurniture, HomeDecorColorPalette } from './entities/home-decor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HomeDecorDesign, HomeDecorFurniture, HomeDecorColorPalette])],
  controllers: [HomeDecorController],
  providers: [HomeDecorService, HomeDecorSeeder],
  exports: [HomeDecorService],
})
export class HomeDecorModule implements OnModuleInit {
  constructor(private seeder: HomeDecorSeeder) {}

  async onModuleInit() {
    try {
      await this.seeder.seed();
    } catch (error) {
      console.log('Seeding skipped or completed');
    }
  }
}

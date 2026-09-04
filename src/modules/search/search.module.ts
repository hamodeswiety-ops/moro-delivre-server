import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ProductEntity } from '../products/entities/product.entity';
import { StoreEntity } from '../stores/entities/store.entity';
import { RatingEntity } from '../ratings/entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, StoreEntity, RatingEntity])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeDecorFurniture, HomeDecorColorPalette } from './entities/home-decor.entity';

@Injectable()
export class HomeDecorSeeder {
  constructor(
    @InjectRepository(HomeDecorFurniture)
    private furnitureRepository: Repository<HomeDecorFurniture>,
    @InjectRepository(HomeDecorColorPalette)
    private paletteRepository: Repository<HomeDecorColorPalette>,
  ) {}

  async seed() {
    const furnitureCount = await this.furnitureRepository.count();
    const paletteCount = await this.paletteRepository.count();

    if (furnitureCount === 0) {
      const furniture: any[] = [
        {
          name: 'أريكة جلد حمراء فاخرة',
          category: 'seating',
          colors: ['#C41E3A', '#8B0000', '#FF6347'],
          image: 'https://via.placeholder.com/300x200?text=Red+Sofa',
          description: 'أريكة جلد طبيعي فاخرة باللون الأحمر مع وسائد مريحة',
          price: 2500,
          rating: 4.8,
        },
        {
          name: 'طاولة قهوة زجاجية عصرية',
          category: 'table',
          colors: ['#E8E8E8', '#333333', '#CCCCCC'],
          image: 'https://via.placeholder.com/300x200?text=Glass+Table',
          description: 'طاولة قهوة زجاجية بتصميم حديث مع قاعدة معدنية',
          price: 800,
          rating: 4.6,
        },
        {
          name: 'رف كتب خشبي طويل',
          category: 'storage',
          colors: ['#8B7355', '#D2B48C', '#654321'],
          image: 'https://via.placeholder.com/300x200?text=Bookshelf',
          description: 'رف كتب خشبي بثلاث طوابق لتخزين الكتب والديكور',
          price: 1200,
          rating: 4.7,
        },
        {
          name: 'مصباح أرضي ذهبي',
          category: 'lighting',
          colors: ['#FFD700', '#FFA500', '#DAA520'],
          image: 'https://via.placeholder.com/300x200?text=Gold+Lamp',
          description: 'مصباح أرضي بتصميم حديث مع رأس قابل للحركة',
          price: 600,
          rating: 4.9,
        },
        {
          name: 'كرسي جلوس مريح',
          category: 'seating',
          colors: ['#4A5F8F', '#708090', '#2F4F7F'],
          image: 'https://via.placeholder.com/300x200?text=Arm+Chair',
          description: 'كرسي جلوس بتصميم إرجونوميكي مع دعم قطني',
          price: 1500,
          rating: 4.5,
        },
        {
          name: 'خزانة تخزين بيضاء',
          category: 'storage',
          colors: ['#FFFFFF', '#F5F5F5', '#EEEEEE'],
          image: 'https://via.placeholder.com/300x200?text=White+Cabinet',
          description: 'خزانة تخزين بيضاء مع أرفف قابلة للتعديل',
          price: 1800,
          rating: 4.4,
        },
      ];

      for (const item of furniture) {
        await this.furnitureRepository.save(item);
      }
      console.log('✅ تم إنشاء بيانات الأثاث');
    }

    if (paletteCount === 0) {
      const palettes: any[] = [
        {
          name: 'الكلاسيكية الدافئة',
          colors: ['#8B7355', '#D2B48C', '#CD853F', '#DEB887'],
          style: 'classic',
          description: 'ألوان دافئة وكلاسيكية للتصاميم التقليدية',
        },
        {
          name: 'الحداثة الزرقاء',
          colors: ['#1E90FF', '#4169E1', '#00BFFF', '#87CEEB'],
          style: 'modern',
          description: 'درجات زرقاء عصرية لتصاميم جريئة',
        },
        {
          name: 'الطبيعة الخضراء',
          colors: ['#228B22', '#32CD32', '#00FF00', '#90EE90'],
          style: 'nature',
          description: 'ألوان خضراء طبيعية هادئة ومريحة',
        },
        {
          name: 'الفخامة الذهبية',
          colors: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520'],
          style: 'luxury',
          description: 'ألوان ذهبية فاخرة وملكية',
        },
        {
          name: 'البساطة الحديثة',
          colors: ['#333333', '#808080', '#CCCCCC', '#FFFFFF'],
          style: 'minimalist',
          description: 'ألوان محايدة بسيطة للتصاميم الحديثة',
        },
        {
          name: 'الشرقية الدافئة',
          colors: ['#8B0000', '#DC143C', '#FF6347', '#FF4500'],
          style: 'oriental',
          description: 'ألوان شرقية دافئة وفاخرة',
        },
      ];

      for (const palette of palettes) {
        await this.paletteRepository.save(palette);
      }
      console.log('✅ تم إنشاء لوحات الألوان');
    }
  }
}

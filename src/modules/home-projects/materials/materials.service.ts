import { Injectable } from '@nestjs/common';

export interface Material {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  availability: boolean;
  supplier: string;
  durability: string;
  eco_friendly: boolean;
}

export interface ColorOption {
  id: string;
  name: string;
  hexCode: string;
  category: string;
  description: string;
}

@Injectable()
export class MaterialsService {
  private materials: Material[] = [
    // Exterior Materials
    {
      id: 'mat_001',
      name: 'Granite Blocks',
      category: 'exterior',
      description: 'Premium granite exterior cladding',
      price: 150,
      availability: true,
      supplier: 'Premium Materials Inc',
      durability: 'Excellent - 50+ years',
      eco_friendly: true,
    },
    {
      id: 'mat_002',
      name: 'Brick Masonry',
      category: 'exterior',
      description: 'Traditional clay brick',
      price: 45,
      availability: true,
      supplier: 'Local Brick Works',
      durability: 'Good - 30+ years',
      eco_friendly: true,
    },
    {
      id: 'mat_003',
      name: 'Aluminum Composite Panel',
      category: 'exterior',
      description: 'Modern lightweight composite',
      price: 65,
      availability: true,
      supplier: 'Tech Materials Ltd',
      durability: 'Very Good - 25+ years',
      eco_friendly: false,
    },
    // Roofing Materials
    {
      id: 'mat_004',
      name: 'Spanish Tile Roofing',
      category: 'roofing',
      description: 'Classic Spanish clay tiles',
      price: 85,
      availability: true,
      supplier: 'Heritage Roofing',
      durability: 'Excellent - 50+ years',
      eco_friendly: true,
    },
    {
      id: 'mat_005',
      name: 'Asphalt Shingles',
      category: 'roofing',
      description: 'Affordable modern shingles',
      price: 35,
      availability: true,
      supplier: 'Budget Roofing',
      durability: 'Good - 25 years',
      eco_friendly: false,
    },
    {
      id: 'mat_006',
      name: 'Metal Standing Seam',
      category: 'roofing',
      description: 'Premium metal roofing',
      price: 120,
      availability: true,
      supplier: 'Premium Metals',
      durability: 'Excellent - 50+ years',
      eco_friendly: true,
    },
    // Flooring Materials
    {
      id: 'mat_007',
      name: 'Marble Flooring',
      category: 'flooring',
      description: 'Luxury marble tiles',
      price: 200,
      availability: true,
      supplier: 'Marble Luxe',
      durability: 'Excellent - 50+ years',
      eco_friendly: true,
    },
    {
      id: 'mat_008',
      name: 'Oak Hardwood',
      category: 'flooring',
      description: 'Premium solid oak wood',
      price: 95,
      availability: true,
      supplier: 'Timber Masters',
      durability: 'Very Good - 30+ years',
      eco_friendly: false,
    },
    {
      id: 'mat_009',
      name: 'Ceramic Tiles',
      category: 'flooring',
      description: 'Durable ceramic tiles',
      price: 50,
      availability: true,
      supplier: 'Ceramic Industries',
      durability: 'Good - 25+ years',
      eco_friendly: true,
    },
    // Wall Materials
    {
      id: 'mat_010',
      name: 'Premium Paint Finish',
      category: 'walls',
      description: 'High-quality interior paint',
      price: 25,
      availability: true,
      supplier: 'Paint Masters',
      durability: 'Good - 10 years',
      eco_friendly: true,
    },
    {
      id: 'mat_011',
      name: 'Wallpaper Luxury',
      category: 'walls',
      description: 'Premium designer wallpaper',
      price: 40,
      availability: true,
      supplier: 'Design Walls',
      durability: 'Good - 10 years',
      eco_friendly: false,
    },
  ];

  private colors: ColorOption[] = [
    { id: 'color_001', name: 'Cream White', hexCode: '#FFFDD0', category: 'neutral', description: 'Warm white tone' },
    { id: 'color_002', name: 'Pure White', hexCode: '#FFFFFF', category: 'neutral', description: 'Bright pure white' },
    { id: 'color_003', name: 'Charcoal Grey', hexCode: '#36454F', category: 'neutral', description: 'Deep grey' },
    { id: 'color_004', name: 'Soft Beige', hexCode: '#F5F5DC', category: 'warm', description: 'Warm beige' },
    { id: 'color_005', name: 'Sand Brown', hexCode: '#C2B280', category: 'warm', description: 'Natural sand' },
    { id: 'color_006', name: 'Terracotta', hexCode: '#E2725B', category: 'warm', description: 'Earthy terracotta' },
    { id: 'color_007', name: 'Navy Blue', hexCode: '#000080', category: 'cool', description: 'Deep navy' },
    { id: 'color_008', name: 'Sky Blue', hexCode: '#87CEEB', category: 'cool', description: 'Light sky blue' },
    { id: 'color_009', name: 'Forest Green', hexCode: '#228B22', category: 'cool', description: 'Deep green' },
    { id: 'color_010', name: 'Sage Green', hexCode: '#9DC183', category: 'cool', description: 'Muted green' },
  ];

  getMaterials(category?: string): Material[] {
    if (!category) return this.materials;
    return this.materials.filter((m) => m.category === category);
  }

  getMaterialById(id: string): Material | undefined {
    return this.materials.find((m) => m.id === id);
  }

  searchMaterials(query: string): Material[] {
    return this.materials.filter(
      (m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase()),
    );
  }

  getColors(): ColorOption[] {
    return this.colors;
  }

  getColorsByCategory(category: string): ColorOption[] {
    return this.colors.filter((c) => c.category === category);
  }

  getColorById(id: string): ColorOption | undefined {
    return this.colors.find((c) => c.id === id);
  }

  calculateMaterialCost(materials: { materialId: string; quantity: number }[]): number {
    let totalCost = 0;
    for (const item of materials) {
      const material = this.getMaterialById(item.materialId);
      if (material) {
        totalCost += material.price * item.quantity;
      }
    }
    return totalCost;
  }

  getEcoFriendlyMaterials(): Material[] {
    return this.materials.filter((m) => m.eco_friendly);
  }

  getMaterialsByBudget(maxPrice: number): Material[] {
    return this.materials.filter((m) => m.price <= maxPrice);
  }

  getRecommendedMaterials(style: string): Material[] {
    const recommendations: Record<string, string[]> = {
      modern: ['mat_003', 'mat_006', 'mat_007', 'mat_010'],
      classic: ['mat_002', 'mat_004', 'mat_008', 'mat_011'],
      minimalist: ['mat_001', 'mat_005', 'mat_009', 'mat_010'],
      rustic: ['mat_002', 'mat_004', 'mat_008', 'mat_011'],
    };

    const ids = recommendations[style] || [];
    return ids
      .map((id) => this.getMaterialById(id))
      .filter((m) => m !== undefined);
  }
}

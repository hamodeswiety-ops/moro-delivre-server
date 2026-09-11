import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PricingService } from '../services/pricing.service';
import { PropertyType } from '../entities/dream-home-project.entity';

@ApiTags('Pricing & Cost Calculation')
@Controller('api/v1/pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('base-price')
  @ApiOperation({ summary: 'Calculate base price' })
  async getBasePrice(
    @Query('propertyType') propertyType: PropertyType,
    @Query('area') area: number,
    @Query('complexity') complexity: 'simple' | 'standard' | 'complex' = 'standard',
  ) {
    const price = this.pricingService.calculateBasePrice(
      propertyType,
      area,
      complexity,
    );
    return { basePrice: price };
  }

  @Post('full-cost')
  @ApiOperation({ summary: 'Calculate full project cost' })
  async getFullCost(
    @Body()
    data: {
      propertyType: PropertyType;
      area: number;
      materialCost: number;
      complexity?: 'simple' | 'standard' | 'complex';
    },
  ) {
    return this.pricingService.calculateFullCost(
      data.propertyType,
      data.area,
      data.materialCost,
      data.complexity,
    );
  }

  @Get('payment-plans/:totalCost')
  @ApiOperation({ summary: 'Get payment plan options' })
  async getPaymentPlans(@Query('totalCost') totalCost: number) {
    return this.pricingService.getPaymentPlans(totalCost);
  }

  @Get('financing-options/:totalCost')
  @ApiOperation({ summary: 'Get financing options' })
  async getFinancingOptions(@Query('totalCost') totalCost: number) {
    return this.pricingService.getFinancingOptions(totalCost);
  }

  @Post('with-addons')
  @ApiOperation({ summary: 'Calculate cost with add-ons' })
  async withAddOns(
    @Body() data: { baseCost: number; addOns: string[] },
  ) {
    const total = this.pricingService.applyAddOns(data.baseCost, data.addOns);
    return { total, addOns: data.addOns };
  }

  @Get('apply-discount')
  @ApiOperation({ summary: 'Apply discount' })
  async applyDiscount(
    @Query('cost') cost: number,
    @Query('discount') discount: number,
  ) {
    const finalCost = this.pricingService.applyDiscount(cost, discount);
    return { originalCost: cost, discount, finalCost };
  }

  @Get('addons')
  @ApiOperation({ summary: 'Get all available add-ons' })
  async getAddOns() {
    return this.pricingService.getAddOns();
  }
}

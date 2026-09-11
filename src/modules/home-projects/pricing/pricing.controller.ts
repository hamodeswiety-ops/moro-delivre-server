import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PricingService } from './pricing.service';

@ApiTags('Pricing & Cost Analysis')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('quote')
  @ApiOperation({ summary: 'Calculate project quote' })
  calculateQuote(
    @Body() projectData: {
      propertyType: string;
      totalArea: number;
      materials: number;
      designComplexity: 'simple' | 'standard' | 'complex';
    }
  ) {
    return this.pricingService.calculateQuote(projectData);
  }

  @Get('payment-plan')
  @ApiOperation({ summary: 'Get payment plan options' })
  getPaymentPlan(
    @Query('totalCost') totalCost: number,
    @Query('terms') terms: 'immediate' | 'installments' | 'monthly' = 'installments',
  ) {
    return this.pricingService.calculatePaymentPlan(totalCost, terms);
  }

  @Get('add-ons')
  @ApiOperation({ summary: 'Get available add-ons' })
  getAddOns() {
    return this.pricingService.getAddOns();
  }

  @Post('with-add-ons')
  @ApiOperation({ summary: 'Calculate cost with add-ons' })
  calculateWithAddOns(
    @Body() body: { baseCost: number; selectedAddOns: string[] },
  ) {
    const total = this.pricingService.calculateWithAddOns(
      body.baseCost,
      body.selectedAddOns,
    );
    return { total };
  }

  @Get('discount')
  @ApiOperation({ summary: 'Apply discount' })
  applyDiscount(
    @Query('totalCost') totalCost: number,
    @Query('discountPercent') discountPercent: number,
  ) {
    const finalCost = this.pricingService.applyDiscount(totalCost, discountPercent);
    return { finalCost, discount: discountPercent };
  }

  @Get('financing-options')
  @ApiOperation({ summary: 'Get financing options' })
  getFinancingOptions(@Query('totalCost') totalCost: number) {
    return this.pricingService.getFinancingOptions(totalCost);
  }
}

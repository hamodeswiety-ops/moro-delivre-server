import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { DiscountType } from './entities/coupon.entity';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new coupon' })
  async createCoupon(
    @Body()
    body: {
      code: string;
      discountValue: number;
      discountType?: DiscountType;
      description?: string;
      minOrderValue?: number;
      maxDiscount?: number;
      usageLimit?: number;
      expiryDate?: string;
    },
  ) {
    return this.couponsService.createCoupon(
      body.code,
      body.discountValue,
      body.discountType || DiscountType.PERCENTAGE,
      body.description,
      body.minOrderValue,
      body.maxDiscount,
      body.usageLimit,
      body.expiryDate ? new Date(body.expiryDate) : undefined,
    );
  }

  @Post('validate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Validate a coupon code' })
  async validateCoupon(
    @Body() body: { code: string; orderTotal: number },
  ) {
    return this.couponsService.validateCoupon(body.code, body.orderTotal);
  }

  @Post('apply')
  @HttpCode(200)
  @ApiOperation({ summary: 'Apply a coupon to an order' })
  async applyCoupon(
    @Body() body: { code: string; orderTotal: number },
  ) {
    return this.couponsService.applyCoupon(body.code, body.orderTotal);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get coupon by code' })
  async getCouponByCode(@Param('code') code: string) {
    return this.couponsService.getCouponByCode(code);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all coupons' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination' })
  @ApiQuery({ name: 'includeInactive', required: false, description: 'Include inactive coupons' })
  async listCoupons(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.couponsService.listCoupons(
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
      includeInactive === 'true',
    );
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active coupons' })
  async getActiveCoupons() {
    return this.couponsService.getActiveCoupons();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get coupon statistics' })
  async getCouponStats() {
    return this.couponsService.getCouponStats();
  }

  @Put(':couponId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a coupon' })
  async updateCoupon(
    @Param('couponId') couponId: string,
    @Body()
    body: {
      description?: string;
      discountValue?: number;
      minOrderValue?: number;
      maxDiscount?: number;
      usageLimit?: number;
      expiryDate?: string;
      isActive?: boolean;
    },
  ) {
    return this.couponsService.updateCoupon(
      couponId,
      body.description,
      body.discountValue,
      body.minOrderValue,
      body.maxDiscount,
      body.usageLimit,
      body.expiryDate ? new Date(body.expiryDate) : undefined,
      body.isActive,
    );
  }

  @Delete(':couponId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a coupon' })
  async deleteCoupon(@Param('couponId') couponId: string) {
    return this.couponsService.deleteCoupon(couponId);
  }
}

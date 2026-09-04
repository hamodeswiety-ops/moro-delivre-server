import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { CouponEntity, DiscountType } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CouponEntity)
    private couponsRepository: Repository<CouponEntity>,
  ) {}

  async createCoupon(
    code: string,
    discountValue: number,
    discountType: DiscountType = DiscountType.PERCENTAGE,
    description?: string,
    minOrderValue?: number,
    maxDiscount?: number,
    usageLimit?: number,
    expiryDate?: Date,
  ) {
    const existingCoupon = await this.couponsRepository.findOne({
      where: { code: code.toUpperCase() },
    });

    if (existingCoupon) {
      throw new BadRequestException('Coupon code already exists');
    }

    if (discountType === DiscountType.PERCENTAGE && (discountValue < 1 || discountValue > 100)) {
      throw new BadRequestException('Percentage discount must be between 1 and 100');
    }

    if (discountValue <= 0) {
      throw new BadRequestException('Discount value must be greater than 0');
    }

    const coupon = this.couponsRepository.create({
      code: code.toUpperCase(),
      discountValue,
      discountType,
      description,
      minOrderValue,
      maxDiscount,
      usageLimit,
      expiryDate,
    });

    await this.couponsRepository.save(coupon);

    return coupon;
  }

  async validateCoupon(code: string, orderTotal: number): Promise<{ valid: boolean; message: string; discount?: number }> {
    const coupon = await this.couponsRepository.findOne({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return { valid: false, message: 'Coupon code not found' };
    }

    if (!coupon.isActive) {
      return { valid: false, message: 'Coupon is not active' };
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return { valid: false, message: 'Coupon has expired' };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }

    if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
      return {
        valid: false,
        message: `Minimum order value of ${coupon.minOrderValue} required for this coupon`,
      };
    }

    let discount = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discount = (orderTotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    return { valid: true, message: 'Coupon is valid', discount: parseFloat(discount.toFixed(2)) };
  }

  async applyCoupon(code: string, orderTotal: number) {
    const validation = await this.validateCoupon(code, orderTotal);

    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    const coupon = await this.couponsRepository.findOne({
      where: { code: code.toUpperCase() },
    });

    coupon.usageCount += 1;
    await this.couponsRepository.save(coupon);

    const finalTotal = orderTotal - validation.discount;

    return {
      originalTotal: parseFloat(orderTotal.toFixed(2)),
      discount: validation.discount,
      finalTotal: parseFloat(finalTotal.toFixed(2)),
      couponCode: code.toUpperCase(),
    };
  }

  async getCouponByCode(code: string) {
    const coupon = await this.couponsRepository.findOne({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }

  async listCoupons(limit: number = 20, offset: number = 0, includeInactive: boolean = false) {
    const query = this.couponsRepository.createQueryBuilder('coupon');

    if (!includeInactive) {
      query.where('coupon.isActive = :isActive', { isActive: true });
    }

    const [coupons, total] = await query
      .orderBy('coupon.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      coupons,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async updateCoupon(
    couponId: string,
    description?: string,
    discountValue?: number,
    minOrderValue?: number,
    maxDiscount?: number,
    usageLimit?: number,
    expiryDate?: Date,
    isActive?: boolean,
  ) {
    const coupon = await this.couponsRepository.findOne({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (description !== undefined) {
      coupon.description = description;
    }

    if (discountValue !== undefined) {
      if (coupon.discountType === DiscountType.PERCENTAGE && (discountValue < 1 || discountValue > 100)) {
        throw new BadRequestException('Percentage discount must be between 1 and 100');
      }
      coupon.discountValue = discountValue;
    }

    if (minOrderValue !== undefined) {
      coupon.minOrderValue = minOrderValue;
    }

    if (maxDiscount !== undefined) {
      coupon.maxDiscount = maxDiscount;
    }

    if (usageLimit !== undefined) {
      coupon.usageLimit = usageLimit;
    }

    if (expiryDate !== undefined) {
      coupon.expiryDate = expiryDate;
    }

    if (isActive !== undefined) {
      coupon.isActive = isActive;
    }

    await this.couponsRepository.save(coupon);

    return coupon;
  }

  async deleteCoupon(couponId: string) {
    const coupon = await this.couponsRepository.findOne({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    await this.couponsRepository.remove(coupon);

    return { message: 'Coupon deleted successfully' };
  }

  async getActiveCoupons() {
    const now = new Date();

    return this.couponsRepository.find({
      where: [
        {
          isActive: true,
          expiryDate: MoreThan(now),
        },
        {
          isActive: true,
          expiryDate: null,
        },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async getCouponStats() {
    const total = await this.couponsRepository.count();
    const active = await this.couponsRepository.count({
      where: { isActive: true },
    });

    const allCoupons = await this.couponsRepository.find();
    const totalUsage = allCoupons.reduce((sum, coupon) => sum + coupon.usageCount, 0);
    const totalDiscount = allCoupons.reduce((sum, coupon) => {
      if (coupon.discountType === DiscountType.FIXED_AMOUNT) {
        return sum + coupon.discountValue * coupon.usageCount;
      }
      return sum;
    }, 0);

    return {
      totalCoupons: total,
      activeCoupons: active,
      totalUsage,
      totalDiscountGiven: parseFloat(totalDiscount.toFixed(2)),
    };
  }
}

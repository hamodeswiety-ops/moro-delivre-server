import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get dashboard summary' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  async getDashboardSummary(@Query('storeId') storeId?: string) {
    return this.analyticsService.getDashboardSummary(storeId);
  }

  @Get('revenue/total')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get total revenue' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  async getTotalRevenue(@Query('storeId') storeId?: string) {
    const revenue = await this.analyticsService.getTotalRevenue(storeId);
    return { totalRevenue: parseFloat(revenue.toFixed(2)) };
  }

  @Get('orders/total')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get total orders' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filter' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for filter' })
  async getTotalOrders(
    @Query('storeId') storeId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const totalOrders = await this.analyticsService.getTotalOrders(storeId, start, end);
    return { totalOrders };
  }

  @Get('deliveries/active')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get active deliveries count' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  async getActiveDeliveries(@Query('storeId') storeId?: string) {
    const activeDeliveries = await this.analyticsService.getActiveDeliveries(storeId);
    return { activeDeliveries };
  }

  @Get('products/top')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get top products' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit number of products' })
  async getTopProducts(@Query('storeId') storeId?: string, @Query('limit') limit?: string) {
    const topProducts = await this.analyticsService.getTopProducts(storeId, limit ? parseInt(limit) : 10);
    return { topProducts };
  }

  @Get('revenue/by-store')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get revenue by store' })
  async getRevenueByStore() {
    const revenueByStore = await this.analyticsService.getRevenueByStore();
    return { revenueByStore };
  }

  @Get('delivery/statistics')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get delivery statistics' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  async getDeliveryStatistics(@Query('storeId') storeId?: string) {
    const statistics = await this.analyticsService.getDeliveryStatistics(storeId);
    return statistics;
  }

  @Get('orders/status-distribution')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get order status distribution' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  async getOrderStatusDistribution(@Query('storeId') storeId?: string) {
    const distribution = await this.analyticsService.getOrderStatusDistribution(storeId);
    return { distribution };
  }

  @Get('payment/method-distribution')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get payment method distribution' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  async getPaymentMethodDistribution(@Query('storeId') storeId?: string) {
    const distribution = await this.analyticsService.getPaymentMethodDistribution(storeId);
    return { distribution };
  }

  @Get('revenue/by-date')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get revenue by date' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to analyze' })
  async getRevenueByDate(@Query('storeId') storeId?: string, @Query('days') days?: string) {
    const revenue = await this.analyticsService.getRevenueByDate(storeId, days ? parseInt(days) : 30);
    return { revenue };
  }

  @Get('drivers/performance')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get driver performance metrics' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  async getDriverPerformance(@Query('storeId') storeId?: string) {
    const performance = await this.analyticsService.getDriverPerformance(storeId);
    return { performance };
  }

  @Get('revenue/monthly-trend')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get monthly revenue trend' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  @ApiQuery({ name: 'months', required: false, description: 'Number of months to analyze' })
  async getMonthlyRevenueTrend(@Query('storeId') storeId?: string, @Query('months') months?: string) {
    const trend = await this.analyticsService.getMonthlyRevenueTrend(storeId, months ? parseInt(months) : 12);
    return { trend };
  }

  @Get('customers/statistics')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get customer statistics' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  async getCustomerStatistics(@Query('storeId') storeId?: string) {
    const statistics = await this.analyticsService.getCustomerStatistics(storeId);
    return statistics;
  }
}

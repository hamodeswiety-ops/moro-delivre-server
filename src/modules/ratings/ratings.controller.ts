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
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new rating' })
  async createRating(
    @Body()
    body: {
      orderId: string;
      productId: string;
      rating: number;
      comment?: string;
      customerEmail?: string;
      customerName?: string;
    },
  ) {
    return this.ratingsService.createRating(
      body.orderId,
      body.productId,
      body.rating,
      body.comment,
      body.customerEmail,
      body.customerName,
    );
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get ratings for a product' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit number of ratings' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination' })
  async getRatingsByProduct(
    @Param('productId') productId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.ratingsService.getRatingsByProduct(
      productId,
      limit ? parseInt(limit) : 10,
      offset ? parseInt(offset) : 0,
    );
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ratings for an order' })
  async getRatingsByOrder(@Param('orderId') orderId: string) {
    return this.ratingsService.getRatingsByOrder(orderId);
  }

  @Get('product/:productId/average')
  @ApiOperation({ summary: 'Get average rating for a product' })
  async getProductAverageRating(@Param('productId') productId: string) {
    return this.ratingsService.getProductAverageRating(productId);
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top rated products' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit number of products' })
  async getTopRatedProducts(@Query('limit') limit?: string) {
    return this.ratingsService.getTopRatedProducts(limit ? parseInt(limit) : 10);
  }

  @Get('product/:productId/distribution')
  @ApiOperation({ summary: 'Get rating distribution for a product' })
  async getRatingDistribution(@Param('productId') productId: string) {
    return this.ratingsService.getRatingDistribution(productId);
  }

  @Put(':ratingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a rating' })
  async updateRating(
    @Param('ratingId') ratingId: string,
    @Body() body: { rating?: number; comment?: string },
  ) {
    return this.ratingsService.updateRating(ratingId, body.rating, body.comment);
  }

  @Delete(':ratingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a rating' })
  async deleteRating(@Param('ratingId') ratingId: string) {
    return this.ratingsService.deleteRating(ratingId);
  }
}

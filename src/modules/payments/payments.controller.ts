import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('stripe/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create Stripe payment' })
  async createStripePayment(@Body() body: { orderId: string }) {
    return this.paymentsService.createStripePayment(body.orderId);
  }

  @Post('stripe/confirm/:paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Confirm Stripe payment' })
  async confirmStripePayment(@Param('paymentId') paymentId: string) {
    return this.paymentsService.confirmStripePayment(paymentId);
  }

  @Post('paypal/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create PayPal payment' })
  async createPayPalPayment(@Body() body: { orderId: string }) {
    return this.paymentsService.createPayPalPayment(body.orderId);
  }

  @Post('paypal/confirm/:paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Confirm PayPal payment' })
  async confirmPayPalPayment(
    @Param('paymentId') paymentId: string,
    @Body() body: { paypalOrderId: string },
  ) {
    return this.paymentsService.confirmPayPalPayment(
      paymentId,
      body.paypalOrderId,
    );
  }

  @Post(':paymentId/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Refund payment' })
  async refundPayment(@Param('paymentId') paymentId: string) {
    return this.paymentsService.refundPayment(paymentId);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by order ID' })
  async getPaymentByOrderId(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrderId(orderId);
  }

  @Get(':paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  async getPaymentById(@Param('paymentId') paymentId: string) {
    return this.paymentsService.getPaymentById(paymentId);
  }
}

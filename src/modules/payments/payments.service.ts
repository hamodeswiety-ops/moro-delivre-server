import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import {
  PaymentEntity,
  PaymentStatus,
  PaymentMethod,
} from './entities/payment.entity';
import { OrderEntity } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  private stripeClient: Stripe;

  constructor(
    @InjectRepository(PaymentEntity)
    private paymentsRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
  ) {
    this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-04-10' as any,
    });
  }

  async createStripePayment(orderId: string, metadata?: any) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const paymentIntent = await this.stripeClient.paymentIntents.create({
      amount: Math.round(parseFloat(order.totalPrice.toString()) * 100),
      currency: 'usd',
      metadata: {
        orderId,
        ...metadata,
      },
      description: `Payment for order ${order.id}`,
    });

    const payment = this.paymentsRepository.create({
      order,
      amount: order.totalPrice,
      status: PaymentStatus.PROCESSING,
      method: PaymentMethod.STRIPE,
      stripePaymentIntentId: paymentIntent.id,
      transactionId: paymentIntent.id,
    });

    await this.paymentsRepository.save(payment);

    return {
      paymentId: payment.id,
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    };
  }

  async confirmStripePayment(paymentId: string) {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (!payment.stripePaymentIntentId) {
      throw new BadRequestException('This payment is not a Stripe payment');
    }

    const paymentIntent = await this.stripeClient.paymentIntents.retrieve(
      payment.stripePaymentIntentId,
    );

    if (paymentIntent.status === 'succeeded') {
      payment.status = PaymentStatus.COMPLETED;
      await this.paymentsRepository.save(payment);
      return { success: true, message: 'Payment confirmed' };
    } else if (paymentIntent.status === 'requires_payment_method') {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'Payment method required';
      await this.paymentsRepository.save(payment);
      throw new BadRequestException('Payment failed');
    }

    return { success: false, status: paymentIntent.status };
  }

  async createPayPalPayment(orderId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = this.paymentsRepository.create({
      order,
      amount: order.totalPrice,
      status: PaymentStatus.PENDING,
      method: PaymentMethod.PAYPAL,
    });

    await this.paymentsRepository.save(payment);

    return {
      paymentId: payment.id,
      amount: order.totalPrice,
      currency: 'USD',
      redirectUrl: `${process.env.APP_URL || 'http://localhost:3000'}/payments/paypal/checkout/${payment.id}`,
    };
  }

  async confirmPayPalPayment(paymentId: string, paypalOrderId: string) {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = PaymentStatus.COMPLETED;
    payment.paypalOrderId = paypalOrderId;
    payment.transactionId = paypalOrderId;

    await this.paymentsRepository.save(payment);

    return { success: true, message: 'PayPal payment confirmed' };
  }

  async refundPayment(paymentId: string) {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Can only refund completed payments');
    }

    if (payment.method === PaymentMethod.STRIPE) {
      const refund = await this.stripeClient.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
      });

      payment.status = PaymentStatus.REFUNDED;
      payment.transactionId = refund.id;
    } else if (payment.method === PaymentMethod.PAYPAL) {
      payment.status = PaymentStatus.REFUNDED;
    }

    await this.paymentsRepository.save(payment);

    return { success: true, message: 'Payment refunded' };
  }

  async getPaymentByOrderId(orderId: string) {
    return this.paymentsRepository.findOne({
      where: { order: { id: orderId } },
      relations: ['order'],
    });
  }

  async getPaymentById(paymentId: string) {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}

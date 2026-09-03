import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryEntity, DeliveryStatus } from './entities/delivery.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryEntity)
    private deliveriesRepository: Repository<DeliveryEntity>,
  ) {}

  async create(createDeliveryDto: any) {
    const delivery = this.deliveriesRepository.create(createDeliveryDto);
    return this.deliveriesRepository.save(delivery);
  }

  async findAll(status?: DeliveryStatus) {
    const query = this.deliveriesRepository.createQueryBuilder('delivery');

    if (status) {
      query.where('delivery.status = :status', { status });
    }

    return query.leftJoinAndSelect('delivery.order', 'order').getMany();
  }

  async findById(id: string) {
    const delivery = await this.deliveriesRepository.findOne({
      where: { id },
      relations: ['order', 'driver'],
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return delivery;
  }

  async assignDriver(id: string, driverId: string) {
    const delivery = await this.findById(id);
    delivery.driver = { id: driverId } as any;
    return this.deliveriesRepository.save(delivery);
  }

  async updateStatus(id: string, status: DeliveryStatus) {
    const delivery = await this.findById(id);
    delivery.status = status;
    return this.deliveriesRepository.save(delivery);
  }

  async updateLocation(id: string, latitude: number, longitude: number) {
    const delivery = await this.findById(id);
    delivery.latitude = latitude;
    delivery.longitude = longitude;
    return this.deliveriesRepository.save(delivery);
  }
}

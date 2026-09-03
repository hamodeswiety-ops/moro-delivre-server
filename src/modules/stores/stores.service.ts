import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreEntity, StoreStatus } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private storesRepository: Repository<StoreEntity>,
  ) {}

  async create(createStoreDto: any, ownerId: string) {
    const store = this.storesRepository.create({
      ...createStoreDto,
      owner: { id: ownerId },
      status: StoreStatus.PENDING,
    });
    return this.storesRepository.save(store);
  }

  async findAll(status?: StoreStatus) {
    const query = this.storesRepository.createQueryBuilder('store');

    if (status) {
      query.where('store.status = :status', { status });
    }

    return query.getMany();
  }

  async findById(id: string) {
    const store = await this.storesRepository.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async update(id: string, updateStoreDto: any) {
    await this.findById(id);
    await this.storesRepository.update(id, updateStoreDto);
    return this.findById(id);
  }

  async approveStore(id: string) {
    await this.findById(id);
    await this.storesRepository.update(id, { status: StoreStatus.APPROVED });
    return this.findById(id);
  }

  async rejectStore(id: string) {
    await this.findById(id);
    await this.storesRepository.update(id, { status: StoreStatus.REJECTED });
    return this.findById(id);
  }

  async suspendStore(id: string) {
    await this.findById(id);
    await this.storesRepository.update(id, { status: StoreStatus.SUSPENDED });
    return this.findById(id);
  }
}

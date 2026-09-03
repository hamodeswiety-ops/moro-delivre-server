import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from '../users/entities/user.entity';
import { StoreEntity, StoreStatus } from '../stores/entities/store.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(StoreEntity)
    private storesRepository: Repository<StoreEntity>,
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async deactivateUser(id: string) {
    await this.usersRepository.update(id, { isActive: false });
    return this.getUserById(id);
  }

  async reactivateUser(id: string) {
    await this.usersRepository.update(id, { isActive: true });
    return this.getUserById(id);
  }

  async getPendingStores() {
    return this.storesRepository.find({
      where: { status: StoreStatus.PENDING },
    });
  }

  async getStats() {
    const totalUsers = await this.usersRepository.count();
    const totalStores = await this.storesRepository.count();
    const totalOrders = await this.ordersRepository.count();
    const approvedStores = await this.storesRepository.count({
      where: { status: StoreStatus.APPROVED },
    });

    return {
      totalUsers,
      totalStores,
      totalOrders,
      approvedStores,
    };
  }

  async seedAdminUser() {
    const adminExists = await this.usersRepository.findOne({
      where: { email: process.env.ADMIN_EMAIL || 'admin@moro.local' },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin@123',
        10,
      );
      const admin = this.usersRepository.create({
        email: process.env.ADMIN_EMAIL || 'admin@moro.local',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isActive: true,
      });

      await this.usersRepository.save(admin);
      console.log('✅ Admin user created successfully');
    }
  }
}

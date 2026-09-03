import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Patch('users/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate user' })
  async deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }

  @Patch('users/:id/reactivate')
  @ApiOperation({ summary: 'Reactivate user' })
  async reactivateUser(@Param('id') id: string) {
    return this.adminService.reactivateUser(id);
  }

  @Get('stores/pending')
  @ApiOperation({ summary: 'Get pending stores' })
  async getPendingStores() {
    return this.adminService.getPendingStores();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get platform statistics' })
  async getStats() {
    return this.adminService.getStats();
  }
}

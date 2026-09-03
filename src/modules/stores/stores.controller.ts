import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new store' })
  async create(@Body() createStoreDto: any) {
    // In real implementation, extract userId from JWT token
    return this.storesService.create(createStoreDto, 'current-user-id');
  }

  @Get()
  @ApiOperation({ summary: 'Get all stores' })
  async findAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  async findOne(@Param('id') id: string) {
    return this.storesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update store' })
  async update(@Param('id') id: string, @Body() updateStoreDto: any) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve store (admin only)' })
  async approve(@Param('id') id: string) {
    return this.storesService.approveStore(id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject store (admin only)' })
  async reject(@Param('id') id: string) {
    return this.storesService.rejectStore(id);
  }

  @Patch(':id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend store (admin only)' })
  async suspend(@Param('id') id: string) {
    return this.storesService.suspendStore(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { DeliveryStatus } from './entities/delivery.entity';

@ApiTags('delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create delivery' })
  async create(@Body() createDeliveryDto: any) {
    return this.deliveryService.create(createDeliveryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all deliveries' })
  async findAll(@Query('status') status?: DeliveryStatus) {
    return this.deliveryService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get delivery by ID' })
  async findOne(@Param('id') id: string) {
    return this.deliveryService.findById(id);
  }

  @Patch(':id/driver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign driver to delivery' })
  async assignDriver(
    @Param('id') id: string,
    @Body('driverId') driverId: string,
  ) {
    return this.deliveryService.assignDriver(id, driverId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update delivery status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: DeliveryStatus,
  ) {
    return this.deliveryService.updateStatus(id, status);
  }

  @Patch(':id/location')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update delivery location' })
  async updateLocation(
    @Param('id') id: string,
    @Body() locationDto: { latitude: number; longitude: number },
  ) {
    return this.deliveryService.updateLocation(
      id,
      locationDto.latitude,
      locationDto.longitude,
    );
  }
}

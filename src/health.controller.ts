import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  root() {
    return { message: 'Moro Delivre API v1.0.0' };
  }
}

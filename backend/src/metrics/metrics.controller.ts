import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

class CreateMetricDto {
  name: string;
  unit: string;
  category?: string;
  description?: string;
}

class UpdateMetricDto {
  name?: string;
  unit?: string;
  category?: string;
  description?: string;
}

class CreateDataPointDto {
  value: number;
  recordedAt?: string; // incoming as string
  note?: string;
}

@Controller('metrics')
@UseGuards(JwtAuthGuard)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  createMetric(@Req() req: any, @Body() body: CreateMetricDto) {
    const userId = req.user.userId;
    return this.metricsService.createMetric(userId, body);
  }

  @Get()
  getMetrics(@Req() req: any) {
    const userId = req.user.userId;
    return this.metricsService.findAllMetrics(userId);
  }

  @Get(':id')
  getMetric(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.metricsService.findMetricById(userId, id);
  }

  @Patch(':id')
  updateMetric(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateMetricDto,
  ) {
    const userId = req.user.userId;
    return this.metricsService.updateMetric(userId, id, body);
  }

  @Delete(':id')
  deleteMetric(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.metricsService.deleteMetric(userId, id);
  }

  @Post(':id/datapoints')
  addDataPoint(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: CreateDataPointDto,
  ) {
    const userId = req.user.userId;

    const dto = {
      value: body.value,
      recordedAt: body.recordedAt ? new Date(body.recordedAt) : undefined,
      note: body.note,
    };

    return this.metricsService.addDataPoint(userId, id, dto);
  }

  @Get(':id/datapoints')
  getDataPoints(
    @Req() req: any,
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const userId = req.user.userId;

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    return this.metricsService.getDataPoints(userId, id, fromDate, toDate);
  }
}

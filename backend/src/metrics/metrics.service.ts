import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

interface CreateMetricDto {
  name: string;
  unit: string;
  category?: string;
  description?: string;
}

interface UpdateMetricDto {
  name?: string;
  unit?: string;
  category?: string;
  description?: string;
}

interface CreateDataPointDto {
  value: number;
  recordedAt?: Date;
  note?: string;
}

@Injectable()
export class MetricsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async createMetric(userId: string, dto: CreateMetricDto) {
    return this.prisma.metric.create({
      data: {
        userId,
        name: dto.name,
        unit: dto.unit,
        category: dto.category,
        description: dto.description,
      },
    });
  }

  async findAllMetrics(userId: string) {
    return this.prisma.metric.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMetricById(userId: string, metricId: string) {
    const metric = await this.prisma.metric.findFirst({
      where: {
        id: metricId,
        userId,
      },
    });

    if (!metric) {
      throw new NotFoundException('Metric not found');
    }

    return metric;
  }

  async updateMetric(userId: string, metricId: string, dto: UpdateMetricDto) {
    await this.findMetricById(userId, metricId);

    return this.prisma.metric.update({
      where: { id: metricId },
      data: {
        name: dto.name,
        unit: dto.unit,
        category: dto.category,
        description: dto.description,
      },
    });
  }

  async deleteMetric(userId: string, metricId: string) {
    await this.findMetricById(userId, metricId);

    await this.prisma.metric.delete({
      where: { id: metricId },
    });

    return { deleted: true };
  }

  async addDataPoint(userId: string, metricId: string, dto: CreateDataPointDto) {
    // Ensure metric belongs to this user
    await this.findMetricById(userId, metricId);

    return this.prisma.metricDataPoint.create({
      data: {
        metricId,
        value: dto.value,
        recordedAt: dto.recordedAt ?? new Date(),
        note: dto.note,
      },
    });
  }

  async getDataPoints(
    userId: string,
    metricId: string,
    from?: Date,
    to?: Date,
  ) {
    await this.findMetricById(userId, metricId);

    return this.prisma.metricDataPoint.findMany({
      where: {
        metricId,
        ...(from || to
          ? {
              recordedAt: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
      orderBy: { recordedAt: 'asc' },
    });
  }

    async getInsights(userId: string, metricId: string) {
    const metric = await this.findMetricById(userId, metricId);

    const datapoints = await this.prisma.metricDataPoint.findMany({
      where: { metricId },
      orderBy: { recordedAt: 'asc' },
    });

    if (!datapoints.length) {
      return { summary: 'No data points yet – add some data to see insights.' };
    }

    const values = datapoints.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    const first = values[0];
    const latest = values[values.length - 1];
    const changeFromFirst = latest - first;
    const trendDirection =
      changeFromFirst > 0.01 ? 'up' : changeFromFirst < -0.01 ? 'down' : 'flat';

    const payload = {
      metric: {
        name: metric.name,
        unit: metric.unit,
        category: metric.category,
        description: metric.description,
      },
      stats: {
        min,
        max,
        avg,
        latest,
        changeFromFirst,
        trendDirection,
        count: values.length,
      },
      datapoints: datapoints.slice(-50).map(d => ({
        value: d.value,
        recordedAt: d.recordedAt,
      })),
    };

    const summary = await this.aiService.generateInsights(payload);

    return { summary };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
  constructor(private prisma: PrismaService) {}

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
}

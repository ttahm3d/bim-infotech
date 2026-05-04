import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllEmployees(): Promise<string> {
    const employees = await this.prisma.employee.findMany({
      select: { name: true },
    });

    return JSON.stringify(employees.map((employee) => employee.name));
  }
}

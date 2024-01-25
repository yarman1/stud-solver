import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class ResourcesService {
    constructor(private prismaService: PrismaService) {}

    async getAreas() {
        return this.prismaService.area.findMany();
    }

    async getArea(id: number) {
        return this.prismaService.area.findUnique({where: {area_id: id}});
    }

    async getProblems(areaId: number) {
        return this.prismaService.problem.findMany({where: {area_id: areaId}})
    }

    async getProblem(id: number) {
        return this.prismaService.problem.findUnique({where: {problem_id: id}});
    }

}

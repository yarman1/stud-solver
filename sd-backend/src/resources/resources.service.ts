import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {AreaResponseDto} from "./dto/area-response.dto";
import {ProblemResponseDto} from "./dto/problem-response.dto";

@Injectable()
export class ResourcesService {
    constructor(private prismaService: PrismaService) {}

    async getAreas() {
        const areas = await this.prismaService.area.findMany();
        const result: AreaResponseDto[] = [];
        for (const area of areas) {
            result.push({
                area_id: area.area_id,
                name: area.name,
                operation_name: area.operation_name,
                picture_url: area.picture_url,
                description: area.description,
            });
        }
        return result;
    }

    async getArea(id: number): Promise<AreaResponseDto> {
        const area = await this.prismaService.area.findUnique({where: {area_id: id}});
        return {
            area_id: area.area_id,
            name: area.name,
            operation_name: area.operation_name,
            picture_url: area.picture_url,
            description: area.description,
        }
    }

    async getProblems(areaId: number) {
        const problems = await this.prismaService.problem.findMany({where: {area_id: areaId}});
        const result: ProblemResponseDto[] = [];
        for (const problem of problems) {
            result.push({
                problem_id: problem.problem_id,
                name: problem.name,
                operation_name: problem.operation_name,
                picture_url: problem.picture_url,
                description: problem.description,
                broad_description_url: problem.broad_description_url,
                area_id: problem.area_id,
            });
        }
        return result;
    }

    async getProblem(id: number) {
        const problem = await this.prismaService.problem.findUnique({where: {problem_id: id}});
        return {
            problem_id: problem.problem_id,
            name: problem.name,
            operation_name: problem.operation_name,
            picture_url: problem.picture_url,
            description: problem.description,
            broad_description_url: problem.broad_description_url,
            area_id: problem.area_id,
        }
    }

}

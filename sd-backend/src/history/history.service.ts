import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {FileHandlerService} from "../file-handler/file-handler.service";
import {MAIN_TYPE} from "../common/constants/main-type.constant";
import {UsersService} from "../users/users.service";
import {OutputFormat} from "../common/types/output-format.type";

@Injectable()
export class HistoryService {
    constructor(
        private prismaService: PrismaService,
        private fileHandlerService: FileHandlerService,
        private usersService: UsersService,
    ) {}

    async getSolution(id: string, user_id: string, format?: OutputFormat | undefined) {
        const solution = await this.prismaService.solution.findUnique({where: {solution_id: id}});
        if (!solution || solution.user_id !== user_id) {
            throw new ForbiddenException('Access to this data is forbidden');
        }
        const problem = await this.prismaService.problem.findUnique({where: {problem_id: solution.problem_id}});

        return this.fileHandlerService.createFile(solution.result_html, (!format ? MAIN_TYPE : format), problem.name);
    }

    async getSolutions(user_id: string) {
        return await this.prismaService.solution
            .findMany({where: {user_id: user_id}})
            .then((data) => {
                return data.map((solution) => {
                    const {user_id, ...cleanSolution} = solution;
                    return cleanSolution;
                })
            });
    }

    async deleteSolution(solution_id: string, user_id: string) {
        const solution = await this.prismaService.solution.findUnique({where: {solution_id: solution_id}});
        if (!solution || solution.user_id !== user_id) {
            throw new ForbiddenException('Access to this data is forbidden');
        }
        return this.prismaService.solution.delete({where: {solution_id: solution_id}});
    }

    async getReport(solutionIdArray: string[], userId: string) {
        const user = await this.usersService.findOneById(userId);
        const htmlContentArray: string[] = [];
        for (const solutionId of solutionIdArray){
            const solution = await this.prismaService.solution.findUnique({where: {solution_id: solutionId}});
            if (!solution) {
                continue;
            }
            htmlContentArray.push(solution.result_html);
        }
        return await this.fileHandlerService.createReport(htmlContentArray, user.user_name);
    }
}

import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class MathDbService {
    constructor(private prisma: PrismaService) {}

    async saveSolution(user_id: string, operation_name: string, resultHtml: string) {
        const problem = await this.prisma.problem.findUnique({where: {operation_name: operation_name}});
        const data = {
            user_id: user_id,
            problem_id: problem.problem_id,
            result_html: resultHtml
        };

        return this.prisma.solution.create({data});
    }
}
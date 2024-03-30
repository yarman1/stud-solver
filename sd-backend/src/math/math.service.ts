import {Injectable} from '@nestjs/common';
import {IndefiniteIntegralDto} from "./dto/indefinite-integral.dto";
import {DefiniteIntegralDto} from "./dto/definite-integral.dto";
import {PrismaService} from "../prisma/prisma.service";
import {TaskDto} from "./dto/task.dto";
import * as ejs from "ejs";
import {join} from "path";
import * as fs from "fs";
import {promisify} from "util";
import {ResultDto} from "./dto/result.dto";
import {TransformedResultDto} from "./dto/transformed-result.dto";
import axios, {AxiosResponse} from "axios";
import {ConfigService} from "@nestjs/config";
import {CustomRequest} from "../types/custom-request.type";
import {Response} from "express";
import {JwtPayload} from "../auth/types/jwtPayload.type";
import {MAIN_TYPE} from "../common/constants/main-type.constant";
import {FileHandlerService} from "../file-handler/file-handler.service";
import {MathDbService} from "./math-db.service";

const readFile = promisify(fs.readFile);

@Injectable()
export class MathService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private readonly fileHandlerService: FileHandlerService,
        private readonly mathDbService: MathDbService
    ) {
    }

    async computeIntegralIndefinite(dto: IndefiniteIntegralDto): Promise<ResultDto> {
        try {
            const response: AxiosResponse<ResultDto> = await axios.post(this.configService.get<string>('PYTHON_SERVER_URL') + "/solve-integral",{
                ...dto
            });
            return response.data;
        } catch (error) {
            console.error('Error calling Flask server for indefinite integral: ', error);
            throw new Error('Failed to compute indefinite integral');
        }
    }

    async computeIntegralDefinite(dto: DefiniteIntegralDto): Promise<ResultDto> {
        try {
            const response: AxiosResponse<ResultDto> = await axios.post(this.configService.get<string>('PYTHON_SERVER_URL') + "/solve-integral",{
                ...dto
            });
            return response.data;
        } catch (error) {
            console.error('Error calling Flask server for definite integral: ', error);
            throw new Error('Failed to compute definite integral');
        }
    }

    async transformSolution(resultObj: ResultDto, task: TaskDto, operation_name: string): Promise<TransformedResultDto> {
        const templatePath = join(__dirname, '../../views/main-solution.ejs');
        const template = await readFile(templatePath, 'utf-8');

        const problem = await this.prisma.problem.findUnique({where: {operation_name: operation_name}});
        const problemName = problem.name;
        const otherProperties = [];
        const otherPropertiesKeys = Object.keys(task)
            .filter(key => key !== 'expression');
        if (otherPropertiesKeys.length !== 0) {
            for (const key of otherPropertiesKeys) {
                let newKey = key.replace(/([A-Z])/g, ' $1');
                newKey = newKey.charAt(0).toUpperCase() + newKey.slice(1);
                otherProperties.push({
                    name: newKey,
                    value: task[key],
                });
            }
        }
        
        const allProps = {
            problemName,
            ...resultObj,
            otherProperties,
        };
        let htmlContent = await ejs.render(template, allProps);
        htmlContent = htmlContent.replace(/\r\n/g, '');
        return {
            htmlContent,
            problemName,
        };
    }

    async handleSolution(dto: TaskDto, result: ResultDto, req: CustomRequest, res: Response, operation_name: string) {
        const resultTransformed = await this.transformSolution(result, dto, operation_name);
        if (req.user) {
            const user: JwtPayload = req.user as JwtPayload;
            const solution_id = await this.mathDbService.saveSolution(user.sub, operation_name, resultTransformed.htmlContent);
            res.json({solution_id: solution_id});
        } else {
            const downloadData = await this.fileHandlerService.createFile(resultTransformed.htmlContent, MAIN_TYPE, resultTransformed.problemName, true);
            res.set(downloadData.headers).send(downloadData.file);
        }
    }
}

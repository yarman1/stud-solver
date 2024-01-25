import {Injectable} from '@nestjs/common';
import {spawn} from 'child_process';
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

const readFile = promisify(fs.readFile);

@Injectable()
export class MathService {
    constructor(private prisma: PrismaService) {
    }

    async computeIntegralIndefinite(dto: IndefiniteIntegralDto): Promise<ResultDto> {
        const args = ['./python-scripts/indefinite-integral.py', dto.expression];
        return await this.activateProcess(args);
    }

    async computeIntegralDefinite(dto: DefiniteIntegralDto): Promise<ResultDto> {
        const args = ['./python-scripts/indefinite-integral.py', dto.expression, dto.lowerLimit, dto.upperLimit, dto.isDecimal];
        return await this.activateProcess(args);
    }

    async activateProcess(args: string[]): Promise<ResultDto> {
        return new Promise((resolve, reject) => {
            const process = spawn('python', args);

            let dataString = '';
            process.stdout.on('data', (data) => {
                dataString += data.toString();
            });

            process.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            process.on('error', (error) => {
                console.error(`Error: ${error}`);
                reject(error);
            });

            process.on('close', (code) => {
                console.log(`Child process exited with code ${code}, output: ${dataString}`); // Added log for debugging
                if (code !== 0) {
                    reject(new Error(`Process exited with code ${code}`));
                } else {
                    try {
                        const result = JSON.parse(dataString);
                        resolve(result);
                    } catch (e) {
                        console.error(`Error parsing JSON: ${e}`);
                        reject(e);
                    }
                }
            });
        });
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

}

import {Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Public} from "../common/decorators/public.decorator";
import {IndefiniteIntegralDto} from "./dto/indefinite-integral.dto";
import {MathService} from "./math.service";
import {DefiniteIntegralDto} from "./dto/definite-integral.dto";
import {AuthenticatedGuard} from "./guards/authenticated.guard";
import {json, Request, Response} from "Express";
import {CustomRequest} from "../types/custom-request.type";
import {MathDbService} from "./math-db.service";
import {FileHandlerService} from "../file-handler/file-handler.service";
import {Operations} from "../common/constants/operations.constants";
import {MAIN_TYPE} from "../common/constants/main-type.constant";
import {ResultDto} from "./dto/result.dto";
import {TaskDto} from "./dto/task.dto";
import {JwtPayload} from "../auth/types/jwtPayload.type";

@Public()
@Controller('math')
export class MathController {
    constructor(
        private readonly mathService: MathService,
        private readonly fileHandlerService: FileHandlerService,
        private readonly mathDbService: MathDbService
    ) {}

    @UseGuards(AuthenticatedGuard)
    @Post(Operations.INDEFINITE_INTEGRAL)
    @HttpCode(HttpStatus.OK)
    async indefiniteIntegral(
        @Body() dto: IndefiniteIntegralDto,
        @Req() req: CustomRequest,
        @Res() res: Response
    ) {
        let result = null;
        try {
            result = await this.mathService.computeIntegralIndefinite(dto);
        } catch (e) {
            res.status(HttpStatus.BAD_REQUEST).json({message: 'Bad input'});
        }
        await this.handleSolution(dto, result, req, res, Operations.INDEFINITE_INTEGRAL);
    }

    @UseGuards(AuthenticatedGuard)
    @Post(Operations.DEFINITE_INTEGRAL)
    @HttpCode(HttpStatus.OK)
    async definiteIntegral(
        @Body() dto: DefiniteIntegralDto,
        @Req() req: CustomRequest,
        @Res() res: Response
    ) {
        let result: ResultDto = null;
        try {
            result = await this.mathService.computeIntegralDefinite(dto);
        } catch (e) {
            res.status(HttpStatus.BAD_REQUEST).json({message: 'Bad input'});
        }
        await this.handleSolution(dto, result, req, res, Operations.DEFINITE_INTEGRAL);
    }

    async handleSolution(dto: TaskDto, result: ResultDto, req: CustomRequest, res: Response, operation_name: string) {
        const resultTransformed = await this.mathService.transformSolution(result, dto, operation_name);
        if (req.user) {
            const user: JwtPayload = req.user as JwtPayload;
            const {solution_id} = await this.mathDbService.saveSolution(user.sub, operation_name, resultTransformed.htmlContent);
            res.json({solution_id: solution_id});
        } else {
            const downloadData = await this.fileHandlerService.createFile(resultTransformed.htmlContent, MAIN_TYPE, resultTransformed.problemName);
            res.set(downloadData.headers).send(downloadData.file);
        }
    }
}

import {Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Public} from "../common/decorators/public.decorator";
import {IndefiniteIntegralDto} from "./dto/indefinite-integral.dto";
import {MathService} from "./math.service";
import {DefiniteIntegralDto} from "./dto/definite-integral.dto";
import {json, Request, Response} from "Express";
import {CustomRequest} from "../types/custom-request.type";
import {MathDbService} from "./math-db.service";
import {FileHandlerService} from "../file-handler/file-handler.service";
import {Operations} from "../common/constants/operations.constants";
import {MAIN_TYPE} from "../common/constants/main-type.constant";
import {ResultDto} from "./dto/result.dto";
import {TaskDto} from "./dto/task.dto";
import {JwtPayload} from "../auth/types/jwtPayload.type";
import {Throttle} from "@nestjs/throttler";

@Public()
@Controller('math')
export class MathController {
    constructor(
        private readonly mathService: MathService,
    ) {}

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
        await this.mathService.handleSolution(dto, result, req, res, Operations.INDEFINITE_INTEGRAL);
    }

    @Throttle({ default: { limit: 1, ttl: 60 * 1000 } })
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
        await this.mathService.handleSolution(dto, result, req, res, Operations.DEFINITE_INTEGRAL);
    }
}

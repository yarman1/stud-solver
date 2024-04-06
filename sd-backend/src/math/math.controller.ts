import {Body, Controller, HttpCode, HttpStatus, Post, Query, Req, Res} from '@nestjs/common';
import {Public} from "../common/decorators/public.decorator";
import {MathService} from "./math.service";
import {Response} from "express";
import {CustomRequest} from "../types/custom-request.type";
import {Throttle} from "@nestjs/throttler";
import {ApiResponse} from "@nestjs/swagger";
import {OperationNameDto} from "./dto/operation-name.dto";

@Public()
@Controller('math')
export class MathController {
    constructor(
        private readonly mathService: MathService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @Throttle({ short: { limit: 12, ttl: 60 * 1000 }, medium: { limit: 700, ttl: 60 * 60 * 1000 } })
    @ApiResponse({description: 'solution_id if signed in; picture if not signed in'})
    async solveProblem(
        @Query() operationNameDto: OperationNameDto,
        @Body() operationDto: any,
        @Req() req: CustomRequest,
        @Res() res: Response
    ) {
        await this.mathService.handleSolution(operationDto, req, res, operationNameDto.operationName)
    }
}

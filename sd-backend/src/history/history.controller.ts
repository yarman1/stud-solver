import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
    Res
} from '@nestjs/common';
import {HistoryService} from "./history.service";
import {Response, Request} from "express";
import {JwtPayload} from "../auth/types/jwtPayload.type";
import {SolutionIdDto} from "./dto/solution-id.dto";
import {DownloadSolutionDto} from "./dto/download-solution.dto";
import {ApiResponse} from "@nestjs/swagger";
import {MessageResponseDto} from "../auth/dto/message-response.dto";
import {SolutionResponseDto} from "./dto/solution-response.dto";

@Controller('history')
export class HistoryController {
    constructor(private historyService: HistoryService) {
    }

    @Get('solution/main/:id')
    @ApiResponse({description: 'picture'})
    async getSolution(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
        const user = req.user as JwtPayload;
        const downloadData = await this.historyService.getSolution(id, user.sub);
        res.set(downloadData.headers).send(downloadData.file);
    }

    @Get('solution/file')
    @ApiResponse({description: 'download pdf/png/jpeg'})
    async downloadSolution(
        @Query() query: DownloadSolutionDto,
        @Res() res: Response,
        @Req() req: Request
    ) {
        const user = req.user as JwtPayload;
        const { solutionId, format } = query;
        const downloadData = await this.historyService.getSolution(solutionId, user.sub, format);
        res.set(downloadData.headers).send(downloadData.file);
    }

    @Get('solutions')
    @ApiResponse({type: SolutionResponseDto, isArray: true})
    async getSolutions(@Res() res: Response, @Req() req: Request) {
        const user = req.user as JwtPayload;
        const solutions = await this.historyService.getSolutions(user.sub);
        res.json(solutions);
    }

    @Post('report')
    @ApiResponse({description: 'download pdf'})
    async getReport(
        @Body() dto: SolutionIdDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const user = req.user as JwtPayload;
        const solutionIdArray = dto.solution_id;
        const downloadData = await this.historyService.getReport(solutionIdArray, user.sub);
        res.set(downloadData.headers).send(downloadData.file);
    }

    @Delete('solution/:id')
    @ApiResponse({type: MessageResponseDto})
    async deleteSolution(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
        const user = req.user as JwtPayload;
        await this.historyService.deleteSolution(id, user.sub);
        res.json({
            message: 'Solution deleted successfully',
        });
    }
}

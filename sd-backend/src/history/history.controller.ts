import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    ParseArrayPipe,
    Post,
    Query,
    Req,
    Res
} from '@nestjs/common';
import {FileHandlerService} from "../file-handler/file-handler.service";
import {MAIN_TYPE} from "../common/constants/main-type.constant";
import {HistoryService} from "./history.service";
import {Response} from "express";
import {Request} from "Express";
import {JwtPayload} from "../auth/types/jwtPayload.type";
import {SolutionIdDto} from "./dto/solution-id.dto";
import {OutputFormat} from "../common/types/output-format.type";
import {DownloadSolutionDto} from "./dto/download-solution.dto";

@Controller('history')
export class HistoryController {
    constructor(private historyService: HistoryService) {
    }

    @Get('solution/:id')
    async getSolution(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
        const user = req.user as JwtPayload;
        const downloadData = await this.historyService.getSolution(id, user.sub);
        res.set(downloadData.headers).send(downloadData.file);
    }

    @Get('solution/file')
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
    async getSolutions(@Res() res: Response, @Req() req: Request) {
        const user = req.user as JwtPayload;
        const solutions = await this.historyService.getSolutions(user.sub);
        res.json(solutions);
    }

    @Post('report')
    async getReport(
        @Body(new ParseArrayPipe({items: SolutionIdDto})) solutionIdArray: string[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const user = req.user as JwtPayload;
        const downloadData = await this.historyService.getReport(solutionIdArray, user.sub);
        res.set(downloadData.headers).send(downloadData.file);
    }

    @Delete('solution/:id')
    async deleteSolution(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
        const user = req.user as JwtPayload;
        await this.historyService.deleteSolution(id, user.sub);
        res.json({
            message: 'Solution deleted successfully',
        });
    }
}

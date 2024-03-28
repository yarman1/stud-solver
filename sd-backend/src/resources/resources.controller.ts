import {Controller, Get, Param} from '@nestjs/common';
import {Public} from "../common/decorators/public.decorator";
import {ResourcesService} from "./resources.service";
import {ApiResponse} from "@nestjs/swagger";
import {AreaResponseDto} from "./dto/area-response.dto";
import {ProblemResponseDto} from "./dto/problem-response.dto";

@Public()
@Controller('resources')
export class ResourcesController {
    constructor(private resourcesService: ResourcesService) {}

    @Get('areas')
    @ApiResponse({type: AreaResponseDto, isArray: true})
    getAreas() {
        return this.resourcesService.getAreas();
    }

    @Get('area/:id')
    @ApiResponse({type: AreaResponseDto})
    getArea(@Param('id') id: number) {
        return this.resourcesService.getArea(id);
    }

    @Get('problems/:areaId')
    @ApiResponse({type: ProblemResponseDto, isArray: true})
    getProblems(@Param('areaId') areaId: number){
        return this.resourcesService.getProblems(areaId);
    }

    @Get('problem/:id')
    @ApiResponse({type: ProblemResponseDto})
    getProblem(@Param('id') id: number) {
        return this.resourcesService.getProblem(id);
    }
}

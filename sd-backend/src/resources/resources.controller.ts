import {Controller, Get, Param} from '@nestjs/common';
import {Public} from "../common/decorators/public.decorator";
import {ResourcesService} from "./resources.service";

@Public()
@Controller('resources')
export class ResourcesController {
    constructor(private resourcesService: ResourcesService) {}

    @Get('areas')
    getAreas() {
        return this.resourcesService.getAreas();
    }

    @Get('area/:id')
    getArea(@Param('id') id: number) {
        return this.resourcesService.getArea(id);
    }

    @Get('problems/:areaId')
    getProblems(@Param('areaId') areaId: number){
        return this.resourcesService.getProblems(areaId);
    }

    @Get('problem/:id')
    getProblem(@Param('id') id: number) {
        return this.resourcesService.getProblem(id);
    }
}

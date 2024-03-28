import {ApiProperty} from "@nestjs/swagger";

export class SolutionResponseDto {
    @ApiProperty()
    solution_id: string;

    @ApiProperty()
    problem_name: string;

    @ApiProperty()
    area_name: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    live_to: Date;
}
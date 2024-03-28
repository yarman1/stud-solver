import {ApiProperty} from "@nestjs/swagger";

export class ProblemResponseDto {
    @ApiProperty()
    problem_id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    operation_name: string;

    @ApiProperty()
    picture_url: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    broad_description_url: string;
}
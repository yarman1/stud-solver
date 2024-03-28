import {IsUUID} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SolutionIdDto {
    @ApiProperty()
    @IsUUID()
    public solution_id: string;
}

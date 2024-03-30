import {ArrayMinSize, IsArray, IsUUID} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SolutionIdDto {
    @ApiProperty()
    @IsArray()
    @IsUUID(4, {each: true})
    @ArrayMinSize(1)
    public solution_id: string[];
}

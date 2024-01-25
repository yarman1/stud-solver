import {IsUUID} from "class-validator";

export class SolutionIdDto {
    @IsUUID()
    public solution_id: string;
}

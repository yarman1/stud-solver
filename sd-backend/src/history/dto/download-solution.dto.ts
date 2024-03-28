import {OutputFormat} from "../../common/types/output-format.type";
import {IsUUID} from "class-validator";
import {IsOutputFormat} from "../validators/is-output-format.validator";
import {ApiProperty} from "@nestjs/swagger";

export class DownloadSolutionDto {
    @ApiProperty()
    @IsOutputFormat()
    public format: OutputFormat;

    @ApiProperty()
    @IsUUID()
    public solutionId: string;
}

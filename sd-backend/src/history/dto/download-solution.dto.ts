import {OutputFormat} from "../../common/types/output-format.type";
import {IsUUID} from "class-validator";
import {IsOutputFormat} from "../validators/is-output-format.validator";

export class DownloadSolutionDto {
    @IsOutputFormat()
    public format: OutputFormat;

    @IsUUID()
    public solutionId: string;
}

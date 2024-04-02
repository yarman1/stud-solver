import {IsOperation} from "../validators/is-operation.validator";
import {Operations} from "../../common/types/operations.type";

export class OperationNameDto {
    @IsOperation()
    operationName: Operations;
}

import {IsUUID} from "class-validator";

export class RecoveryDto {
    @IsUUID()
    public token: string;
}

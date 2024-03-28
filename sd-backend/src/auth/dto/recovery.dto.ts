import {IsUUID} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RecoveryDto {
    @ApiProperty()
    @IsUUID()
    public token: string;
}

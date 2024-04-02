import { Operations } from '../../common/types/operations.type';
import {DefiniteIntegralDto} from "../dto/operations-dto/definite-integral.dto";
import {IndefiniteIntegralDto} from "../dto/operations-dto/indefinite-integral.dto";
import {TaskDto} from "../dto/task.dto";

export const dtoMapping: { [key in Operations]?: new () => TaskDto } = {
    [Operations.DEFINITE_INTEGRAL]: DefiniteIntegralDto,
    [Operations.INDEFINITE_INTEGRAL]: IndefiniteIntegralDto,
};

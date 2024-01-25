import { Request } from "Express";

export interface CustomRequest extends Request {
    isGuest?: boolean;
}
import { ValidationError } from "./ValidationError";

export interface HttpError {
    errors: ValidationError[];
    status_code: number;
    error_message: string;
    error_body: any;
}
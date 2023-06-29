import { AppError } from "./app-error";

export class BadRequest extends AppError {
    constructor(error) {
        super(error);
    }
}
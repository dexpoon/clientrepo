import { AppError } from "./app-error";



export class NotFoudError extends AppError {
        constructor(error) {
            super(error);
        }
}
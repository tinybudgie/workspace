export class CommonError<T> extends Error {
    code: T

    constructor(code: T, message?: string) {
        super(message)
        this.code = code
    }
}

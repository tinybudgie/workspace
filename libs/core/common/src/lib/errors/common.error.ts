import { COMMON_ERROR_TITLES, CommonErrorsEnum } from './common-errors.enum'

export class CommonError<
    T extends string = CommonErrorsEnum,
    M = Record<string, string>,
> extends Error {
    code: T
    metadata?: M

    constructor(
        code: T,
        message?: { [code: string]: string } | string,
        metadata?: M,
    ) {
        super(
            message === undefined
                ? COMMON_ERROR_TITLES[
                      (code as string) ||
                          COMMON_ERROR_TITLES[CommonErrorsEnum.Error]
                  ]
                : typeof message === 'string'
                ? message
                : message[code],
        )
        this.code = code
        this.metadata = metadata
    }
}

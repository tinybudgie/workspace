/* eslint-disable @typescript-eslint/no-explicit-any */
const ERROR_CODE_P2002 = 'P2002'
const ERROR_CODE_P2025 = 'P2025'
const ERROR_SUBSTRING_RECORD_NOT_FOUND = 'NotFoundError'
const ERROR_SUBSTRING_DELETE_RECORD_NOT_FOUND =
    'Record to delete does not exist'
const ERROR_SUBSTRING_UPDATE_RECORD_NOT_FOUND = 'Record to update not found'

export function ErrorOfRecordNotFound(err: Error): boolean {
    return (
        String(err).includes(ERROR_SUBSTRING_RECORD_NOT_FOUND) ||
        String(err).includes(ERROR_CODE_P2025) ||
        String(err).includes(ERROR_SUBSTRING_DELETE_RECORD_NOT_FOUND) ||
        String(err).includes(ERROR_SUBSTRING_UPDATE_RECORD_NOT_FOUND)
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ErrorOfUniqueField<T, K = any>(
    prismaError: { code: string; meta: { target: string[] } },
    field: keyof T,
    error: any,
    defaultError: any = null,
): any {
    return prismaError.code === ERROR_CODE_P2002 &&
        prismaError.meta?.target.includes(field as string)
        ? error
        : defaultError
}

export function ErrorsOfUniqueField<T>(
    prismaError: { code: string; meta: { target: string[] } },
    errors: {
        field: keyof T
        error: any
    }[],
): any {
    const firstError = errors.find((error) =>
        ErrorOfUniqueField<T>(prismaError, error.field, true),
    )

    return firstError
        ? ErrorOfUniqueField<T>(prismaError, firstError.field, firstError.error)
        : prismaError
}

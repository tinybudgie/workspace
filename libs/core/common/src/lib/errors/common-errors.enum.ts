export enum CommonErrorsEnum {
    Error = 'ERROR-000',
    NotFound = 'ERROR-001',
    Forbidden = 'ERROR-002',
    UnexpectedError = 'ERROR-003',
    ValidationError = 'ERROR-004',
    UniqueError = 'ERROR-005',
    RequestError = 'ERROR-006',
    UnauthorizedError = 'ERROR-007',
}

export const COMMON_ERROR_TITLES = {
    [CommonErrorsEnum.Error]: 'Error',
    [CommonErrorsEnum.NotFound]: 'Not found',
    [CommonErrorsEnum.Forbidden]: 'Forbidden',
    [CommonErrorsEnum.UnexpectedError]: 'Unexpected error',
    [CommonErrorsEnum.ValidationError]: 'Validation error',
    [CommonErrorsEnum.UniqueError]: 'Unique error',
    [CommonErrorsEnum.RequestError]: 'Request error',
    [CommonErrorsEnum.UnauthorizedError]: 'Unauthorized',
}

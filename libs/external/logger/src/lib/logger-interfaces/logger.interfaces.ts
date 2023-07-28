export interface DefaultLog {
    message: string
    level: LogLevel
    label?: string
    stack?: string
}

export interface JsonLog {
    message: string
    level: string
    label?: string
    stack?: string
}

export interface LogMethodOptions {
    label?: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'timer'

/**
 * Logger interface from NestJS
 * https://github.com/nestjs/nest/blob/master/packages/common/services/logger.service.ts
 */
export interface LoggerInterface {
    log(message: any, ...optionalParams: any[]): any
    error(message: any, ...optionalParams: any[]): any
    warn(message: any, ...optionalParams: any[]): any
    debug?(message: any, ...optionalParams: any[]): any
    verbose?(message: any, ...optionalParams: any[]): any
    setLogLevels?(levels: LogLevel[]): any
}

export interface LoggerConfig {
    /**
     * Put labels with will be show in console
     * @notice Default: `*`
     */
    labels?: string | string[] | false

    /**
     * @notice Default: `false`
     */
    json?: boolean

    colors?: {
        timestamp?: string
        label?: string
        message?: string
        stack?: string
    }
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import chalk from 'chalk'
import { get } from 'env-var'
import { isMatch } from 'micromatch'
import { performance } from 'perf_hooks'

import {
    DefaultLog,
    JsonLog,
    LoggerConfig,
    LoggerInterface,
    LogLevel,
    LogMethodOptions,
} from './logger-interfaces/logger.interfaces'
import { clc } from './logger-utils/cli-colors.util'
import { isPlainObject } from './logger-utils/utils'

const isProduction = get('NOVE_ENV').asString() === 'production'

const JSON_SPACE = 2

export class LoggerCore implements LoggerInterface {
    private _timers: Map<string, number> = new Map()

    _config: LoggerConfig = {
        labels: ['*'],
        colors: {
            timestamp: '#E5E5E5',
            label: '#E5E5E5',
        },
    }

    log(message: any, options?: LogMethodOptions): void
    log(message: any, ...optionalParams: [...any, string?]): void
    log(message: any, ...optionalParams: any[]): void {
        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'log')
    }

    error(message: any, options?: LogMethodOptions, stack?: string): void
    error(message: any, ...optionalParams: [...any, string?, string?]): void
    error(message: any, ...optionalParams: any[]): void {
        const { options, stack } = this._findOptionsAndStack(optionalParams)
        this._printMessage(message, options, 'error', 'stderr', stack)
    }

    warn(message: any, options?: LogMethodOptions): void
    warn(message: any, ...optionalParams: [...any, string?]): void
    warn(message: any, ...optionalParams: any[]): void {
        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'warn')
    }

    debug(message: any, options?: LogMethodOptions): void
    debug(message: any, ...optionalParams: [...any, string?]): void
    debug(message: any, ...optionalParams: any[]): void {
        if (isProduction) {
            return
        }

        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'debug')
    }

    verbose(message: any, options?: LogMethodOptions): void
    verbose(message: any, ...optionalParams: [...any, string?]): void
    verbose(message: any, ...optionalParams: any[]): void {
        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'verbose')
    }

    markTime(marker: string): void {
        this._timers.set(marker, performance.now())
    }

    measureTime(
        marker: string,
        message?: string,
        options?: LogMethodOptions,
    ): number {
        const timeStart = this._timers.get(marker)

        if (timeStart === undefined) {
            return 0
        }

        const time = performance.now() - timeStart

        if (message) {
            const formattedMessage = message.replace(
                RegExp('{n}'),
                `${time.toFixed(3)}`,
            )

            const foundOptions = this._findOptions([options])
            this._printMessage(formattedMessage, foundOptions, 'timer')
        }

        return time
    }

    private _getTimestamp(): string {
        const time = new Date().toISOString()

        // 2021-09-24T05:10:47.306Z => 2021-09-24 05:10:47
        return `[${`${time.substr(0, 10)} ${time.substr(11, 12)}`}]`
    }

    private _printMessage(
        message: any,
        options: LogMethodOptions,
        logLevel: LogLevel,
        writeStreamType?: 'stdout' | 'stderr',
        stack?: string,
    ): void {
        const { label } = options

        if (label && !this._isLabelAllowed(label)) {
            return
        }

        let computedMessage = ''

        const { json } = this._config

        if (json) {
            computedMessage = this._createJsonLog({
                message,
                label,
                level: logLevel,
                stack,
            })
        } else {
            computedMessage = this._createDefaultLog({
                message,
                label,
                level: logLevel,
                stack,
            })
        }

        process[writeStreamType ?? 'stdout'].write(computedMessage)
    }

    private _createJsonLog(data: JsonLog): string {
        const { message, level, label, stack } = data

        return `\n${JSON.stringify({
            timestamp: new Date().toISOString(),
            message: isPlainObject(message)
                ? JSON.stringify(message, (key, value) =>
                      typeof value === 'bigint' ? value.toString() : value,
                  )
                : (message as string),
            level,
            label,
            stack,
        })}`
    }

    private _createDefaultLog(data: DefaultLog): string {
        const { message, level, label, stack } = data
        const { colors } = this._config

        const color = this._getColorByLogLevel(level)

        const output = isPlainObject(message)
            ? ` Object:\n${JSON.stringify(
                  message,
                  (key, value) =>
                      typeof value === 'bigint' ? value.toString() : value,
                  JSON_SPACE,
              )}`
            : ` ${message as string}`

        const timestamp = chalk.hex(colors!.timestamp!)(this._getTimestamp())
        const labelMessage = label
            ? chalk.hex(colors!.label!)(' [' + label + ']')
            : ''
        const formattedLogLevel = color(level.toUpperCase().padStart(8))
        const stackMessage = stack ? `\n${stack}` : ''

        const coloredOutput = colors!.message
            ? chalk.hex(colors!.message)(output)
            : output
        const coloredStack = colors!.stack
            ? chalk.hex(colors!.stack)(stackMessage)
            : stackMessage

        const finalMessage =
            timestamp +
            formattedLogLevel +
            labelMessage +
            coloredOutput +
            coloredStack +
            '\n'

        return finalMessage
    }

    private _findOptions(args: unknown[]): LogMethodOptions {
        const options = args.find(
            (arg: any) =>
                typeof arg === 'object' && ('trace' in arg || 'label' in arg),
        )

        if (!options) {
            return {}
        }

        return options
    }

    private _findOptionsAndStack(args: unknown[]): {
        options: LogMethodOptions
        stack?: string
    } {
        const options = args.find(
            (arg: any) =>
                typeof arg === 'object' && ('trace' in arg || 'label' in arg),
        ) as LogMethodOptions

        const stacktraceRegex = new RegExp(/at /g)

        const stack = args.find(
            (arg) => typeof arg === 'string' && stacktraceRegex.test(arg),
        ) as string

        if (!options) {
            return {
                stack,
                options: {},
            }
        }

        return {
            options,
            stack,
        }
    }

    private _isLabelAllowed(label: string): boolean {
        const { labels } = this._config

        if (labels === undefined) {
            return true
        }

        if (labels === false) {
            return false
        }

        return isMatch(label, labels)
    }

    private _getColorByLogLevel(level: LogLevel): (text: string) => string {
        switch (level) {
            case 'debug':
                return clc.magentaBright
            case 'warn':
                return clc.yellow
            case 'error':
                return clc.red
            case 'verbose':
                return clc.cyanBright
            case 'timer':
                return clc.lightGreen
            default:
                return clc.green
        }
    }
}

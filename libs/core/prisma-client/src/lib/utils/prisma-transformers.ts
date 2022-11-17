export function getInDate(date: string | Date) {
    const dateOffset = 24 * 60 * 60 * 1000 * 1

    const lt = new Date(
        typeof date !== 'string'
            ? date.toISOString().substring(0, 10)
            : date.substring(0, 10) + ' 00:00:00',
    )
    lt.setTime(lt.getTime() + dateOffset)

    const gte = new Date(
        typeof date !== 'string'
            ? date.toISOString().substring(0, 10)
            : date.substring(0, 10) + ' 00:00:00',
    )
    gte.setTime(gte.getTime())
    return {
        lt,
        gte,
    }
}

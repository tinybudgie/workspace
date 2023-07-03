export enum NatsErrorsEnum {
    Timeout = 'NATS-000',
    NoResponders = 'NATS-001',
    NoConnection = 'NATS-002',
}

export const NATS_ERROR_TITLES = {
    [NatsErrorsEnum.Timeout]: `Someone is listening but didn't respond`,
    [NatsErrorsEnum.NoResponders]: `No one is listening to this request`,
    [NatsErrorsEnum.NoConnection]: `No connection established to NATS`,
}

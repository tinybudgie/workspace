export enum NatsErrorsEnum {
    Timeout = 'NATS-000',
    NoResponders = 'NATS-001',
    NoConnection = 'NATS-002',
    JetStreamNotEnabled = 'NATS-003',
    JetStreamNotEnabledConfig = 'NATS-004',
    UnknownConnectionName = 'NATS-005',
}

export const NATS_ERROR_TITLES = {
    [NatsErrorsEnum.Timeout]: `Someone is listening but didn't respond`,
    [NatsErrorsEnum.NoResponders]: `No one is listening to this request`,
    [NatsErrorsEnum.NoConnection]: `No connection established to NATS`,
    [NatsErrorsEnum.JetStreamNotEnabled]: `JetStream not enabled. Please provide '--jetstream' option to your nats server`,
    [NatsErrorsEnum.JetStreamNotEnabledConfig]: `JetStream not enabled. Please provide 'enableJetStream: true' option to your nats module config`,
    [NatsErrorsEnum.UnknownConnectionName]: `Provide connection name if you use multiple NATS connections`,
}

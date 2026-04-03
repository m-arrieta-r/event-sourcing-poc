export interface Command<TName extends string, TPayload> {
  name: TName;
  payload: TPayload;
}

export interface DomainEvent<TName extends string, TPayload> {
  name: TName;
  aggregateId: string;
  version: number;
  timestamp: Date;
  payload: TPayload;
}

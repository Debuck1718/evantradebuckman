export interface Command<TPayload = unknown> {
  readonly type: string;
  readonly payload: TPayload;
}
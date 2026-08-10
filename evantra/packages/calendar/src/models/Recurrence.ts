export type RecurrenceFrequency =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY";

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval?: number;
  count?: number;
  until?: Date;
  byWeekday?: readonly number[];
}

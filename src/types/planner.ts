import type { Dayjs } from "dayjs";

export enum ShiftStatus {
  NEW = "NEW",
  DRAFT = "DRAFT",
  PROPOSED = "PROPOSED",
  ACCEPTED = "ACCEPTED",
}

export interface Shift {
  id: string;
  notes: string;
  location: string;
  status: ShiftStatus;
  employeeId: string;
  statusUpdated: string;
  to: Dayjs;
  break: number;
  from: Dayjs;
}

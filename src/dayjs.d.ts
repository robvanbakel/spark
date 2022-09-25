import "dayjs";

declare module "dayjs" {
  interface Dayjs {
    weekId(input?: string): string;
    dateTime(input?: string): string;
  }
}

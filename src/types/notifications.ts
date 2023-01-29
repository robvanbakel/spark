export interface Notification {
  id: string;
  type?: NotificationType;
  title: string;
  message: string;
  persistent?: boolean;
  leaving?: boolean;
}

export enum NotificationType {
  INFO = "INFO",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

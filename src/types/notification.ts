export type NotificationType = "recruitment" | "interview" | "result" | "general";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  clubId: string;
  isRead: boolean;
  createdAt: string;
}


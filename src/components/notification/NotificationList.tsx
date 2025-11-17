import type { NotificationItem } from "../../types/notification";
import { NotificationCard } from "./NotificationCard";

interface NotificationListProps {
  notifications: NotificationItem[];
  onViewClub: (clubId: string) => void;
}

export function NotificationList({ notifications, onViewClub }: NotificationListProps) {
  if (notifications.length === 0) {
    return <div className="py-12 text-center text-gray-500">알림이 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onViewClub={onViewClub}
        />
      ))}
    </div>
  );
}


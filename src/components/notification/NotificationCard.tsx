import type { NotificationItem } from "../../types/notification";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { NotificationIcon } from "./NotificationIcon";

interface NotificationCardProps {
  notification: NotificationItem;
  onViewClub: (clubId: string) => void;
}

export function NotificationCard({ notification, onViewClub }: NotificationCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
        !notification.isRead ? "border-l-4 border-l-blue-600 bg-blue-50/50" : ""
      }`}
    >
      <div className="flex gap-4">
        <div className="mt-1 shrink-0">
          <NotificationIcon type={notification.type} />
        </div>
        <div className="flex-1">
          <div className="mb-1 flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-base font-semibold">
              {notification.title}
            </h3>
            {!notification.isRead && (
              <Badge className="shrink-0 bg-blue-600">NEW</Badge>
            )}
          </div>
          <p className="mb-2 text-sm text-gray-600">{notification.message}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>{notification.createdAt}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewClub(notification.clubId)}
            >
              자세히 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


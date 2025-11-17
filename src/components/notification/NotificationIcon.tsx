import { AlertCircle, Bell, Calendar, CheckCircle } from "lucide-react";

import type { NotificationType } from "../../types/notification";

interface NotificationIconProps {
  type: NotificationType;
}

const ICONS: Record<NotificationType, JSX.Element> = {
  recruitment: <Bell className="h-5 w-5 text-blue-600" />,
  interview: <Calendar className="h-5 w-5 text-purple-600" />,
  result: <CheckCircle className="h-5 w-5 text-green-600" />,
  general: <AlertCircle className="h-5 w-5 text-gray-600" />,
};

export function NotificationIcon({ type }: NotificationIconProps) {
  return ICONS[type] ?? ICONS.general;
}


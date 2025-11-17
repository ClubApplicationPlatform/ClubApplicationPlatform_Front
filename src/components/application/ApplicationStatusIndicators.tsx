import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

import type { ApplicationStatus } from "../../types/application";
import { Badge, badgeVariants } from "../../ui/badge";
import { cn } from "../../ui/utils";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

interface StatusMeta {
  label: string;
  badgeVariant: BadgeVariant;
  badgeClassName?: string;
  icon: LucideIcon;
  iconClassName: string;
}

const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  pending: {
    label: "서류 검토중",
    badgeVariant: "outline",
    badgeClassName: "border-yellow-500 text-yellow-700",
    icon: AlertCircle,
    iconClassName: "text-yellow-600",
  },
  document_passed: {
    label: "서류 합격",
    badgeVariant: "outline",
    badgeClassName: "border-green-500 text-green-700",
    icon: CheckCircle,
    iconClassName: "text-green-600",
  },
  interview_scheduled: {
    label: "면접 예정",
    badgeVariant: "outline",
    badgeClassName: "border-blue-500 text-blue-700",
    icon: Clock,
    iconClassName: "text-blue-600",
  },
  accepted: {
    label: "합격",
    badgeVariant: "default",
    badgeClassName: "bg-green-600 text-white hover:bg-green-700",
    icon: CheckCircle,
    iconClassName: "text-green-600",
  },
  rejected: {
    label: "불합격",
    badgeVariant: "outline",
    badgeClassName: "border-gray-400 text-gray-600",
    icon: XCircle,
    iconClassName: "text-gray-600",
  },
};

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const meta = STATUS_META[status];

  return (
    <Badge variant={meta.badgeVariant} className={cn(meta.badgeClassName)}>
      {meta.label}
    </Badge>
  );
}

interface ApplicationStatusIconProps {
  status: ApplicationStatus;
  className?: string;
}

export function ApplicationStatusIcon({
  status,
  className,
}: ApplicationStatusIconProps) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return <Icon className={cn("h-5 w-5", meta.iconClassName, className)} />;
}


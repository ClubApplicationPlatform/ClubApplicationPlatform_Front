import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

import type { Application } from "../../types/application";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";

type Tone = "green" | "blue" | "gray";

const TONE_STYLES: Record<Tone, Record<string, string>> = {
  green: {
    container: "bg-green-50",
    title: "text-green-900",
    message: "text-green-800",
    icon: "text-green-600",
  },
  blue: {
    container: "bg-blue-50",
    title: "text-blue-900",
    message: "text-blue-800",
    icon: "text-blue-600",
  },
  gray: {
    container: "bg-gray-50",
    title: "text-gray-900",
    message: "text-gray-700",
    icon: "text-gray-600",
  },
};

interface StatusSectionProps {
  tone: Tone;
  icon: LucideIcon;
  title: string;
  message: string;
  children?: ReactNode;
}

function StatusSection({ tone, icon: Icon, title, message, children }: StatusSectionProps) {
  const styles = TONE_STYLES[tone];

  return (
    <div className={cn("rounded-lg p-4", styles.container)}>
      <div className="mb-2 flex items-center gap-2">
        <Icon className={cn("h-4 w-4", styles.icon)} />
        <span className={cn("font-medium", styles.title)}>{title}</span>
      </div>
      <p
        className={cn(
          "text-sm",
          styles.message,
          children ? "mb-3" : undefined
        )}
      >
        {message}
      </p>
      {children}
    </div>
  );
}

interface ApplicationStatusHighlightsProps {
  application: Application;
  onSelectInterview: () => void;
}

const extractFirstUrl = (value?: string | null) => {
  if (!value) {
    return null;
  }

  return value.match(/https?:\/\/[^\s]+/i)?.[0] ?? null;
};

export function ApplicationStatusHighlights({
  application,
  onSelectInterview,
}: ApplicationStatusHighlightsProps) {
  const sections: ReactNode[] = [];

  if (application.status === "document_passed" && application.documentResult) {
    sections.push(
      <StatusSection
        key="document"
        tone="green"
        icon={CheckCircle}
        title="서류 합격"
        message={application.documentResult.message}
      >
        <Button
          size="sm"
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={onSelectInterview}
        >
          면접 일정 선택하기
        </Button>
      </StatusSection>
    );
  }

  if (application.status === "interview_scheduled" && application.interviewSlot) {
    const interviewLocation = application.interviewLocation;
    const details = interviewLocation
      ? `${application.interviewSlot} · ${interviewLocation}`
      : application.interviewSlot;
    sections.push(
      <StatusSection
        key="interview"
        tone="blue"
        icon={Calendar}
        title="면접 일정"
        message={details}
      />
    );
  }

  if (application.status === "accepted" && application.result) {
    const chatUrl = extractFirstUrl(application.result.message);
    const openChat = () => {
      if (!chatUrl) {
        return;
      }
      window.open(chatUrl, "_blank", "noopener,noreferrer");
    };

    sections.push(
      <StatusSection
        key="accepted"
        tone="green"
        icon={CheckCircle}
        title="합격 안내"
        message={application.result.message}
      >
        {chatUrl && (
          <Button size="sm" onClick={openChat}>
            카카오톡 오픈채팅 참여하기
          </Button>
        )}
      </StatusSection>
    );
  }

  if (application.status === "rejected" && application.result) {
    sections.push(
      <StatusSection
        key="rejected"
        tone="gray"
        icon={XCircle}
        title="결과 안내"
        message={application.result.message}
      />
    );
  }

  if (sections.length === 0) {
    return null;
  }

  return <div className="space-y-4">{sections}</div>;
}

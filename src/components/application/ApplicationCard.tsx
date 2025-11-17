import type { NavigateFunction } from "react-router-dom";

import type { Application } from "../../types/application";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ApplicationActionButtons } from "./ApplicationActionButtons";
import { ApplicationStatusHighlights } from "./ApplicationStatusHighlights";
import {
  ApplicationStatusBadge,
  ApplicationStatusIcon,
} from "./ApplicationStatusIndicators";

interface ApplicationCardProps {
  application: Application;
  onNavigate: NavigateFunction;
}

export function ApplicationCard({
  application,
  onNavigate,
}: ApplicationCardProps) {
  const openClubDetail = () => {
    onNavigate(`/clubs/${application.clubId}`);
  };

  const openApplicationDetail = () => {
    onNavigate(`/applications/${application.id}`);
  };

  const openInterviewScheduler = () => {
    onNavigate(`/clubs/${application.clubId}/interview`);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <ApplicationStatusIcon status={application.status} />
            <div>
              <CardTitle className="mb-1 text-lg font-semibold">
                {application.clubName}
              </CardTitle>
              <p className="text-sm text-gray-600">지원일: {application.appliedAt}</p>
            </div>
          </div>
          <ApplicationStatusBadge status={application.status} />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <ApplicationStatusHighlights
            application={application}
            onSelectInterview={openInterviewScheduler}
          />
          <ApplicationActionButtons
            onOpenClub={openClubDetail}
            onOpenApplication={openApplicationDetail}
          />
        </div>
      </CardContent>
    </Card>
  );
}


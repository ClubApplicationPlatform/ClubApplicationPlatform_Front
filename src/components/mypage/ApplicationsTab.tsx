import type { NavigateFunction } from "react-router-dom";

import type { Application } from "../../types/application";
import { ApplicationCard } from "../application/ApplicationCard";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";

interface ApplicationsTabProps {
  applications: Application[];
  onNavigate: NavigateFunction;
}

export function ApplicationsTab({
  applications,
  onNavigate,
}: ApplicationsTabProps) {
  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <p className="mb-4 text-gray-500">아직 지원한 동아리가 없습니다.</p>
          <Button
            className="hover:cursor-pointer"
            onClick={() => onNavigate("/clubs")}
          >
            동아리 둘러보기
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

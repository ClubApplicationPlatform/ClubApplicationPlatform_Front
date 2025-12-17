import type { Application } from "../../types/application";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

type ApplicationStatus = Application["status"];

interface FilteredClubApplicationsTabProps {
  statusFilter?: ApplicationStatus[];
}

interface ClubApplicationsTabProps extends FilteredClubApplicationsTabProps {
  applications: Application[];
  onSelectApplication: (applicationId: string) => void;
  onQuickStatusChange?: (
    applicationId: string,
    status: ApplicationStatus
  ) => void;
}

function getStatusBadge(status: ApplicationStatus) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
          검토중
        </Badge>
      );
    case "document_passed":
      return (
        <Badge variant="outline" className="border-green-500 text-green-700">
          서류 합격
        </Badge>
      );
    case "interview_scheduled":
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-700">
          면접 예정
        </Badge>
      );
    case "accepted":
      return <Badge className="bg-green-600">합격</Badge>;
    case "rejected":
      return (
        <Badge variant="outline" className="border-gray-400 text-gray-600">
          불합격
        </Badge>
      );
    default:
      return null;
  }
}

export function ClubApplicationsTab({
  applications,
  onSelectApplication,
  statusFilter,
  onQuickStatusChange,
}: ClubApplicationsTabProps) {
  const displayedApplications = statusFilter
    ? applications.filter((application) =>
        statusFilter.includes(application.status)
      )
    : applications;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>지원자 목록</CardTitle>
          <Badge variant="outline">총 {applications.length}명</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedApplications.map((application) => (
            <div
              key={application.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h3>{application.applicantName}</h3>
                  {getStatusBadge(application.status)}
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>{application.studentId}</span>
                  <span>{application.department}</span>
                  <span>{application.phone}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  지원일: {application.appliedAt}
                </p>
                {application.status === "interview_scheduled" &&
                  onQuickStatusChange && (
                    <div className="mt-3 grid w-full max-w-xs grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          onQuickStatusChange(application.id, "accepted")
                        }
                      >
                        면접 합격
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          onQuickStatusChange(application.id, "rejected")
                        }
                      >
                        불합격
                      </Button>
                    </div>
                  )}
              </div>
              <Button
                className="hover:cursor-pointer"
                onClick={() => onSelectApplication(application.id)}
              >
                상세보기
              </Button>
            </div>
          ))}

          {displayedApplications.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              아직 지원자가 없습니다.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

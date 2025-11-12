import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export type ApplicationStatus =
  | "pending"
  | "document_passed"
  | "interview_scheduled"
  | "accepted"
  | "rejected"
  | (string & {});

export interface ClubApplication {
  id: string;
  applicantName: string;
  studentId: string;
  department: string;
  phone: string;
  appliedAt: string;
  status: ApplicationStatus;
}

interface ClubApplicationsTabProps {
  applications: ClubApplication[];
  onSelectApplication: (applicationId: string) => void;
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
}: ClubApplicationsTabProps) {
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
          {applications.map((application) => (
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
              </div>
              <Button onClick={() => onSelectApplication(application.id)}>
                상세보기
              </Button>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="py-12 text-center text-gray-500">아직 지원자가 없습니다.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

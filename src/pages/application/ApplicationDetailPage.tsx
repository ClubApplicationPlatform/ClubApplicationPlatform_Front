import { type ReactNode, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import { toast } from "sonner";

import { mockApplications, mockClubs } from "../../lib/mockData";
import { useAuthStore } from "../../stores/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

type ApplicationStatus =
  | "pending"
  | "document_passed"
  | "interview_scheduled"
  | "accepted"
  | "rejected";

export function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const application = useMemo(
    () => mockApplications.find((item) => item.id === applicationId),
    [applicationId]
  );
  const club = application
    ? mockClubs.find((item) => item.id === application.clubId)
    : null;
  const isAdmin = Boolean(club && user && club.adminId === user.id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | "">(
    ""
  );

  const openConfirm = (status: ApplicationStatus) => {
    setPendingStatus(status);
    setIsDialogOpen(true);
  };

  const closeConfirm = () => {
    setIsDialogOpen(false);
    setPendingStatus("");
  };

  const confirmStatusChange = () => {
    if (!pendingStatus) return;
    const message =
      pendingStatus === "accepted"
        ? "최종 합격 처리되었습니다."
        : pendingStatus === "document_passed"
          ? "서류 합격 처리되었습니다."
          : pendingStatus === "interview_scheduled"
            ? "면접 일정이 확정되었습니다."
            : "불합격 처리되었습니다.";
    toast.success(message);
    closeConfirm();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4">로그인이 필요합니다.</p>
            <Button onClick={() => navigate("/login")}>
              로그인 페이지로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4">지원서를 찾을 수 없습니다.</p>
            <Button onClick={() => navigate("/my-page")}>
              마이페이지로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const goBack = () => {
    if (isAdmin) {
      navigate(`/clubs/${application.clubId}/manage`);
      return;
    }
    navigate("/my-page");
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-700"
          >
            서류 검토중
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
  };

  const renderAnswerSection = () => {
    if (!application.answers.length) {
      return (
        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
          제출된 자기소개가 없습니다.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {application.answers.map((answer, index) => (
          <Card key={`${answer.question}-${index}`}>
            <CardHeader className="bg-gray-50">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600">Q{index + 1}</Badge>
                <CardTitle className="text-lg">{answer.question}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 whitespace-pre-wrap">
              {answer.answer}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Button
        variant="ghost"
        onClick={goBack}
        className="mb-6  hover:cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {isAdmin ? "신청자 관리로 돌아가기" : "마이페이지로 돌아가기"}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="mb-2">
                {application.clubName} 지원서
              </CardTitle>
              <p className="text-sm text-gray-600">
                지원일: {application.appliedAt}
              </p>
            </div>
            {getStatusBadge(application.status as ApplicationStatus)}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <section>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              지원자 정보
            </h3>
            <div className="grid gap-3 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
              <InfoRow label="이름">{application.applicantName}</InfoRow>
              <InfoRow label="학번">{application.studentId}</InfoRow>
              <InfoRow label="학과">{application.department}</InfoRow>
              <InfoRow label="연락처">{application.phone}</InfoRow>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              자기소개 및 문항 답변
            </h3>
            {renderAnswerSection()}
          </section>

          {application.status === "pending" && (
            <section>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                면접 가능 시간
              </h3>
              <div className="rounded-lg bg-gray-50 p-4 text-gray-700">
                평일 오후 6시 이후, 주말 오전/오후 모두 가능
              </div>
            </section>
          )}

          {application.status === "interview_scheduled" &&
            application.interviewSlot && (
              <section className="rounded-lg bg-blue-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-blue-900">
                  면접 일정
                </h3>
                <p className="text-blue-800">{application.interviewSlot}</p>
              </section>
            )}

          {application.status === "accepted" && application.result && (
            <section className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-2 text-lg font-semibold text-green-900">
                합격 안내
              </h3>
              <p className="text-green-800">{application.result.message}</p>
            </section>
          )}

          {application.status === "rejected" && application.result && (
            <section className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                심사 결과
              </h3>
              <p className="text-gray-700">{application.result.message}</p>
            </section>
          )}

          {isAdmin ? (
            <AdminActions
              status={application.status as ApplicationStatus}
              onStatusChange={openConfirm}
            />
          ) : (
            <div className="flex flex-col gap-2 pt-4 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => navigate(`/clubs/${application.clubId}`)}
                className="flex-1"
              >
                동아리 페이지
              </Button>
              <Button onClick={() => navigate("/my-page")} className="flex-1">
                마이페이지로 돌아가기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <ConfirmDialog
          open={isDialogOpen}
          onCancel={closeConfirm}
          onConfirm={confirmStatusChange}
          title="지원서 상태 변경"
          description="지원서 상태를 변경하시겠습니까?"
        />
      )}
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col rounded-md border border-gray-100 bg-white p-3 text-sm text-gray-700">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-base font-medium text-gray-900">{children}</span>
    </div>
  );
}

function AdminActions({
  status,
  onStatusChange,
}: {
  status: ApplicationStatus;
  onStatusChange: (next: ApplicationStatus) => void;
}) {
  return (
    <div className="space-y-3 pt-4">
      {status === "pending" && (
        <>
          <Button
            onClick={() => onStatusChange("document_passed")}
            className="w-full bg-green-600 hover:bg-green-700 hover:cursor-pointer"
          >
            <Check className="mr-2 h-4 w-4" />
            서류 합격 처리
          </Button>
          <Button
            variant="destructive"
            onClick={() => onStatusChange("rejected")}
            className="w-full hover:cursor-pointer"
          >
            <X className="mr-2 h-4 w-4" />
            불합격 처리
          </Button>
        </>
      )}

      {status === "document_passed" && (
        <Button
          variant="destructive"
          onClick={() => onStatusChange("rejected")}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          불합격 처리
        </Button>
      )}

      {status === "interview_scheduled" && (
        <>
          <Button
            onClick={() => onStatusChange("accepted")}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            최종 합격 처리
          </Button>
          <Button
            variant="destructive"
            onClick={() => onStatusChange("rejected")}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            불합격 처리
          </Button>
        </>
      )}
    </div>
  );
}

function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button onClick={onConfirm}>변경</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

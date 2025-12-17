import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import {
  ClipboardList,
  Bell,
  Users,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { mockClubs, mockQuestions } from "../../lib/mockData";
import { ClubApplicationsTab } from "../../components/club/ClubApplicationsTab";
import { ClubNoticesTab } from "../../components/club/ClubNoticesTab";
import { ClubQuestionsTab } from "../../components/club/ClubQuestionsTab";
import { ClubSettingsTab } from "../../components/club/ClubSettingsTab";
import { useAuthStore } from "../../stores/authStore";
import { useActiveCampus } from "../../hooks/useActiveCampus";
import {
  getApplicationsForClub,
  upsertLocalApplication,
} from "../../lib/applications";
import type { Application } from "../../types/application";
import type { ApplicationStatus } from "../../types/application";
import { LOCAL_APPLICATIONS_EVENT } from "../../lib/localApplications";
import { getOpenChatLink } from "../../lib/kakaoLinks";

const STATUS_TABS: { label: string; value: ApplicationStatus | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "서류 검토중", value: "pending" },
  { label: "서류 합격", value: "document_passed" },
  { label: "면접 예정", value: "interview_scheduled" },
  { label: "최종 합격", value: "accepted" },
  { label: "불합격", value: "rejected" },
];

type StatusTabValue = (typeof STATUS_TABS)[number]["value"];

export function ClubManagerPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const campus = useActiveCampus();
  const club = mockClubs.find((c) => c.id === clubId);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeStatus, setActiveStatus] = useState<StatusTabValue>("pending");
  const [pendingDecision, setPendingDecision] = useState<{
    application: Application;
    status: ApplicationStatus;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const listener = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener(LOCAL_APPLICATIONS_EVENT, listener);
    return () => window.removeEventListener(LOCAL_APPLICATIONS_EVENT, listener);
  }, []);

  const applications = useMemo(
    () => (clubId ? getApplicationsForClub(clubId) : []),
    [clubId, refreshKey]
  );

  const statusCounts = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      pending: 0,
      document_passed: 0,
      interview_scheduled: 0,
      accepted: 0,
      rejected: 0,
    };
    applications.forEach((application) => {
      counts[application.status] += 1;
    });
    return counts;
  }, [applications]);

  const initialQuestions = useMemo(
    () => mockQuestions.filter((q) => q.clubId === clubId),
    [clubId]
  );

  const initialDeadline = club?.recruitDeadline
    ? new Date(club.recruitDeadline)
    : undefined;

  const statusFilter =
    activeStatus === "all"
      ? undefined
      : ([activeStatus] as ApplicationStatus[]);

  const refuseDecision = () => setPendingDecision(null);

  const handleQuickStatusChange = (
    applicationId: string,
    status: ApplicationStatus
  ) => {
    const application = applications.find((item) => item.id === applicationId);
    if (!application) {
      return;
    }
    setPendingDecision({ application, status });
  };

  const handleDecisionConfirm = () => {
    if (!pendingDecision) {
      return;
    }
    const { application, status } = pendingDecision;
    const patch: Partial<Application> = { status };
    if (status === "accepted") {
      const chatLink = getOpenChatLink(application.clubId);
      patch.result = {
        status: "accepted",
        message:
          "면접 결과 최종합격되었어요. 아래 버튼으로 오픈카카오톡에 들어가세요!",
        decidedAt: new Date().toISOString().split("T")[0],
        openChatLink: chatLink,
      };
    } else if (status === "rejected") {
      patch.result = {
        status: "rejected",
        message: "최종 면접 결과 불합격 처리되었습니다.",
        decidedAt: new Date().toISOString().split("T")[0],
      };
    }
    upsertLocalApplication(application, patch);
    toast.success(
      status === "accepted" ? "최종 합격 처리 완료" : "불합격 처리 완료"
    );
    refuseDecision();
  };

  if (!clubId || !club) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p>동아리를 찾을 수 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p>로그인이 필요합니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (club && campus && club.campusId !== campus.id) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-2">
              해당 학교 동아리 관리자만 이용하실 수 있습니다.
            </p>
            <Button onClick={() => navigate("/clubs")} className="mt-4">
              동아리 목록으로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (club.adminId !== user.id) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-2">접근 권한이 없습니다.</p>
            <p className="text-sm text-gray-600">
              이 동아리의 관리자만 관리 페이지를 볼 수 있습니다.
            </p>
            <Button
              onClick={() => navigate(`/clubs/${clubId}`)}
              className="mt-4"
            >
              동아리 페이지로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2">{club.name} 관리자</h1>
        <p className="text-gray-600">지원서와 면접을 관리하세요.</p>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger
            value="applications"
            className="gap-2 hover:cursor-pointer"
          >
            <ClipboardList className="h-4 w-4" />
            지원자 관리
          </TabsTrigger>
          <TabsTrigger value="notices" className="gap-2 hover:cursor-pointer">
            <Bell className="h-4 w-4" />
            공지사항
          </TabsTrigger>
          <TabsTrigger value="questions" className="gap-2 hover:cursor-pointer">
            <Users className="h-4 w-4" />
            질문 설정
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 hover:cursor-pointer">
            <CalendarIcon className="h-4 w-4" />
            모집 설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => {
              const isActive = activeStatus === tab.value;
              const count =
                tab.value === "all"
                  ? applications.length
                  : statusCounts[tab.value as ApplicationStatus];
              return (
                <Button
                  key={tab.value}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setActiveStatus(tab.value)}
                  className="gap-2 text-sm"
                >
                  <span>{tab.label}</span>
                  <span className="text-xs text-gray-500">{count}명</span>
                </Button>
              );
            })}
          </div>
          <ClubApplicationsTab
            applications={applications}
            onSelectApplication={(applicationId) =>
              navigate(`/applications/${applicationId}`)
            }
            statusFilter={statusFilter}
            onQuickStatusChange={handleQuickStatusChange}
          />
        </TabsContent>

        <TabsContent value="notices" className="mt-6">
          <ClubNoticesTab clubId={clubId} initialNotices={club.notices} />
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <ClubQuestionsTab
            clubId={clubId}
            initialQuestions={initialQuestions}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <ClubSettingsTab
            club={club}
            initialDeadline={initialDeadline}
            onNavigateInterview={() => navigate(`/clubs/${clubId}/interview`)}
          />
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={Boolean(pendingDecision)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            refuseDecision();
          }
        }}
      >
        <AlertDialogContent className="w-[min(90vw,360px)]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDecision?.status === "accepted"
                ? "최종합격 처리"
                : "불합격 처리"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDecision?.status === "accepted"
                ? "최종합격 처리하면 오픈카카오톡 링크를 지원자에게 전달합니다."
                : "불합격 처리하면 해당 지원자는 결과를 확인하게 됩니다."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDecisionConfirm}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

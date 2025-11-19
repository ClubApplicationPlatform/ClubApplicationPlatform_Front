import { useNavigate, useParams } from "react-router-dom";
import {
  ClipboardList,
  Bell,
  Users,
  Calendar as CalendarIcon,
} from "lucide-react";

import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { mockClubs, mockQuestions, mockApplications } from "../../lib/mockData";
import { ClubApplicationsTab } from "../../components/club/ClubApplicationsTab";
import { ClubNoticesTab } from "../../components/club/ClubNoticesTab";
import { ClubQuestionsTab } from "../../components/club/ClubQuestionsTab";
import { ClubSettingsTab } from "../../components/club/ClubSettingsTab";
import { useAuthStore } from "../../stores/authStore";
import { useActiveCampus } from "../../hooks/useActiveCampus";

export function ClubManagerPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const campus = useActiveCampus();
  const club = mockClubs.find((c) => c.id === clubId);

  const applications = mockApplications.filter((a) => a.clubId === clubId);
  const initialQuestions = mockQuestions.filter((q) => q.clubId === clubId);
  const initialDeadline = club?.recruitDeadline
    ? new Date(club.recruitDeadline)
    : undefined;

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
            <p className="mb-2">해당 학교 동아리만 관리할 수 있어요.</p>
            <Button onClick={() => navigate("/clubs")} className="mt-4">
              목록으로 이동
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
              이 동아리의 관리자만 관리 페이지에 접근할 수 있습니다.
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
        <h1 className="mb-2">{club.name} 관리</h1>
        <p className="text-gray-600">동아리 모집 신청을 관리하세요</p>
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

        <TabsContent value="applications" className="mt-6">
          <ClubApplicationsTab
            applications={applications}
            onSelectApplication={(applicationId) =>
              navigate(`/applications/${applicationId}`)
            }
          />
        </TabsContent>

        <TabsContent value="notices" className="mt-6">
          <ClubNoticesTab notices={club.notices} />
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
    </div>
  );
}

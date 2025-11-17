import { useNavigate } from "react-router-dom";

import { ApplicationCard } from "../../components/application/ApplicationCard";
import { mockApplications } from "../../lib/mockData";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";

export function MyApplicationsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userApplications = user
    ? mockApplications.filter(
        (application) => application.applicantId === user.id
      )
    : [];

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-gray-600">로그인이 필요합니다.</p>
            <Button onClick={() => navigate("/login")}>로그인 하러 가기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">내 지원 현황</h1>
        <p className="text-gray-600">지원한 동아리의 심사 현황을 확인하세요</p>
      </div>

      <div className="space-y-4">
        {userApplications.length > 0 ? (
          userApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onNavigate={navigate}
            />
          ))
        ) : (
          <Card>
            <CardContent className="py-20 text-center">
              <p className="mb-4 text-gray-500">아직 지원한 동아리가 없습니다.</p>
              <Button onClick={() => navigate("/clubs")}>동아리 둘러보기</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

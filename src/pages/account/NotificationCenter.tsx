import { useNavigate } from "react-router-dom";

import { NotificationList } from "../../components/notification/NotificationList";
import { mockNotifications } from "../../lib/mockData";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export function NotificationCenter() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

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

  const handleViewClub = (clubId: string) => navigate(`/clubs/${clubId}`);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">알림</h1>
        <p className="text-gray-600">동아리 모집, 면접, 합격 소식을 확인하세요.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>전체 알림</CardTitle>
            <Button variant="ghost" size="sm">
              모두 읽음으로 표시
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <NotificationList
            notifications={mockNotifications}
            onViewClub={handleViewClub}
          />
        </CardContent>
      </Card>
    </div>
  );
}


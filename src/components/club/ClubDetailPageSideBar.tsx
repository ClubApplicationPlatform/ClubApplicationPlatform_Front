import { Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { type Club } from "../../lib/mockData";

interface ClubSideBarProps {
  club: Club;
  onApply: () => void;
}

export default function ClubDetailPageSideBar({
  club,
  onApply,
}: ClubSideBarProps) {
  return (
    <div className="space-y-6 mt-17">
      <Card>
        <CardHeader>
          <CardTitle>모집정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">모집 상태</span>
            <Badge
              className={club.isRecruiting ? "bg-green-600" : "bg-gray-400"}
            >
              {club.isRecruiting ? "모집중" : "모집 마감"}
            </Badge>
          </div>

          {club.isRecruiting && club.recruitDeadline && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">모집 마감</span>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{club.recruitDeadline}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">회원 수</span>
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4" />
              <span>{club.members}명</span>
            </div>
          </div>

          {club.isRecruiting && (
            <Button onClick={onApply} className="w-full hover:cursor-pointer">
              지원하기
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

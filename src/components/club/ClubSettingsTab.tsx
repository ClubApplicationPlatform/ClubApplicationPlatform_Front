import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import type { Club } from "../../lib/mockData";

interface ClubSettingsTabProps {
  club: Club;
  initialDeadline?: Date;
  onNavigateInterview: () => void;
}

export function ClubSettingsTab({
  club,
  initialDeadline,
  onNavigateInterview,
}: ClubSettingsTabProps) {
  const [deadline, setDeadline] = useState<Date | undefined>(initialDeadline);
  const [notifyApplicants, setNotifyApplicants] = useState(false);

  const handleSetDeadline = () => {
    if (!deadline) {
      toast.error("날짜를 선택해주세요.");
      return;
    }
    toast.success("지원 마감일이 설정되었습니다.");
  };

  const handleCloseRecruitment = () => {
    toast.success("모집이 종료되었습니다.");
  };

  const handleStartRecruitment = () => {
    if (!deadline) {
      toast.error("먼저 지원 마감일을 설정해주세요.");
      return;
    }
    toast.success("모집이 시작되었습니다.");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>모집 상태</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="mb-1">현재 상태</h3>
              <p className="text-sm text-gray-600">
                {club.isRecruiting ? "모집 중입니다" : "모집이 종료되었습니다"}
              </p>
            </div>
            <Badge
              className={club.isRecruiting ? "bg-green-600" : "bg-gray-400"}
            >
              {club.isRecruiting ? "모집중" : "모집 마감"}
            </Badge>
          </div>

          {club.isRecruiting ? (
            <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <div>
                <h3 className="mb-1 text-red-900">모집 종료</h3>
                <p className="text-sm text-red-700">
                  모집을 종료하면 지원자에게 알림을 보낼 수 있습니다. 신중하게
                  결정해주세요.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifyApplicants"
                  className=" hover:cursor-pointer"
                  checked={notifyApplicants}
                  onCheckedChange={(checked) =>
                    setNotifyApplicants(checked as boolean)
                  }
                />
                <Label
                  htmlFor="notifyApplicants"
                  className="cursor-pointer text-sm text-red-900 hover:cursor-pointer"
                >
                  지원자에게 알림 보내기
                </Label>
              </div>
              <Button
                onClick={handleCloseRecruitment}
                variant="destructive"
                className="w-full hover:cursor-pointer"
              >
                모집 종료하기
              </Button>
            </div>
          ) : (
            <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-4 hover:cursor-pointer">
              <div>
                <h3 className="mb-1 text-green-900">모집 시작</h3>
                <p className="text-sm text-green-700">
                  지원 마감일을 설정해야 모집을 시작할 수 있습니다.
                  {!deadline && " 먼저 날짜를 설정해주세요."}
                </p>
              </div>
              <Button
                onClick={handleStartRecruitment}
                className="w-full bg-green-600 hover:bg-green-700 hover:cursor-pointer"
              >
                모집 시작하기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>지원 마감일 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deadline">마감일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:cursor-pointer"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 hover:cursor-pointer"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            onClick={handleSetDeadline}
            className="w-full hover:cursor-pointer"
          >
            마감일 저장
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>면접 일정 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onNavigateInterview}
            className="w-full hover:cursor-pointer"
          >
            면접 일정 설정하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

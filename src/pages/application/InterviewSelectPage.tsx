import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { InterviewApplyDialog } from "../../components/interview/InterviewApplyDialog";
import { InterviewSlotForm } from "../../components/interview/InterviewSlotForm";
import { InterviewSlotList } from "../../components/interview/InterviewSlotList";
import { mockClubs, mockInterviewSlots } from "../../lib/mockData";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export function InterviewSelectPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const club = mockClubs.find((item) => item.id === clubId);
  const interviewSlots = mockInterviewSlots.filter((slot) => slot.clubId === clubId);

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [capacity, setCapacity] = useState("3");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<
    { id: string; date: string; time: string } | null
  >(null);

  if (!club) {
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

  const isAdmin = club.adminId === user.id;

  const handleCreateSlot = () => {
    if (!date || !startTime || !duration || !capacity) {
      toast.error("모든 항목을 입력해주세요.");
      return;
    }

    toast.success("면접 시간이 생성되었습니다.");
    setStartTime("");
  };

  const handleOpenConfirmDialog = (slotId: string, slotDate: string, slotTime: string) => {
    if (selectedSlotId !== null) {
      return;
    }
    setPendingSlot({ id: slotId, date: slotDate, time: slotTime });
    setConfirmDialogOpen(true);
  };

  const handleConfirmApplySlot = () => {
    if (!pendingSlot) {
      return;
    }

    toast.success(`면접 일정이 신청되었습니다!\n${pendingSlot.date} ${pendingSlot.time}`);
    setSelectedSlotId(pendingSlot.id);
    setConfirmDialogOpen(false);
    setPendingSlot(null);
    setTimeout(() => navigate("/mypage"), 1500);
  };

  const handleCancelApplySlot = () => {
    setConfirmDialogOpen(false);
    setPendingSlot(null);
  };

  const handleBackNavigation = () => {
    navigate(isAdmin ? `/clubs/${clubId}/manage` : "/mypage");
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Button variant="ghost" onClick={handleBackNavigation} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {isAdmin ? "동아리 관리로 돌아가기" : "마이페이지로 돌아가기"}
      </Button>

      <div className="mb-8">
        <h1 className="mb-2">{isAdmin ? "면접 일정 관리" : "면접 일정 선택"}</h1>
        <p className="text-gray-600">
          {club.name} - {isAdmin ? "면접 일정을 생성하고 관리하세요" : "원하시는 면접 시간을 선택해주세요"}
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${isAdmin ? "lg:grid-cols-2" : ""}`}>
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>면접 일정 생성</CardTitle>
            </CardHeader>
            <CardContent>
              <InterviewSlotForm
                date={date}
                startTime={startTime}
                duration={duration}
                capacity={capacity}
                onDateChange={setDate}
                onStartTimeChange={setStartTime}
                onDurationChange={setDuration}
                onCapacityChange={setCapacity}
                onSubmit={handleCreateSlot}
              />
            </CardContent>
          </Card>
        )}

        <Card className={isAdmin ? "" : "lg:col-span-1"}>
          <CardHeader>
            <CardTitle>{isAdmin ? "생성된 면접 일정" : "면접 가능한 시간"}</CardTitle>
          </CardHeader>
          <CardContent>
            <InterviewSlotList
              slots={interviewSlots}
              isAdmin={isAdmin}
              selectedSlotId={selectedSlotId}
              onSelectSlot={(slot) => handleOpenConfirmDialog(slot.id, slot.date, slot.startTime)}
            />
          </CardContent>
        </Card>
      </div>

      <InterviewApplyDialog
        open={confirmDialogOpen}
        slotInfo={pendingSlot ? { date: pendingSlot.date, time: pendingSlot.time } : null}
        onOpenChange={(open) => {
          setConfirmDialogOpen(open);
          if (!open) {
            setPendingSlot(null);
          }
        }}
        onConfirm={handleConfirmApplySlot}
        onCancel={handleCancelApplySlot}
      />
    </div>
  );
}

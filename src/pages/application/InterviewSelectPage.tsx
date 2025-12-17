import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { InterviewApplyDialog } from "../../components/interview/InterviewApplyDialog";
import { InterviewSlotForm } from "../../components/interview/InterviewSlotForm";
import { InterviewSlotList } from "../../components/interview/InterviewSlotList";
import { mockClubs, mockInterviewSlots } from "../../lib/mockData";
import { useAuthStore } from "../../stores/authStore";
import { useActiveCampus } from "../../hooks/useActiveCampus";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { getApplicationsForUser, assignInterviewSlot } from "../../lib/applications";
import {
  addLocalInterviewSlot,
  bookInterviewSlot,
  deleteLocalInterviewSlot,
  getLocalInterviewSlots,
} from "../../lib/localInterviewSlots";

function calculateEndTime(startTime: string, extraMinutes: number) {
  const [hours, minutes] = startTime.split(":").map((value) => Number(value));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return startTime;
  }
  const total = hours * 60 + minutes + extraMinutes;
  const endHours = Math.floor(total / 60) % 24;
  const endMinutes = total % 60;
  return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
}

export function InterviewSelectPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const campus = useActiveCampus();

  const club = mockClubs.find((item) => item.id === clubId);
  const mockSlots = mockInterviewSlots.filter((slot) => slot.clubId === clubId);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [capacity, setCapacity] = useState("3");
  const [location, setLocation] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<
    { id: string; date: string; time: string; location: string } | null
  >(null);
  const [slotRefreshKey, setSlotRefreshKey] = useState(0);

  const storedSlots = useMemo(
    () => (clubId ? getLocalInterviewSlots(clubId) : []),
    [clubId, slotRefreshKey]
  );
  const combinedSlots = useMemo(() => {
    const storedIds = new Set(storedSlots.map((slot) => slot.id));
    const merged = [
      ...storedSlots,
      ...mockSlots.filter((slot) => !storedIds.has(slot.id)),
    ];
    return merged.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [mockSlots, storedSlots]);

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

  if (campus && club.campusId !== campus.id) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4">해당 학교 동아리의 가입자만 면접에 접근할 수 있어요.</p>
            <Button onClick={() => navigate("/clubs")}>동아리 목록으로 돌아가기</Button>
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
      toast.error("일정을 모두 입력해주세요.");
      return;
    }

    if (!location.trim()) {
      toast.error("면접 장소를 입력해주세요.");
      return;
    }

    const durationValue = Number(duration);
    const capacityValue = Number(capacity);
    if (Number.isNaN(durationValue) || durationValue <= 0) {
      toast.error("올바른 면접 시간을 입력해주세요.");
      return;
    }
    if (Number.isNaN(capacityValue) || capacityValue <= 0) {
      toast.error("참가 인원을 1명 이상으로 설정해주세요.");
      return;
    }
    if (!clubId) {
      toast.error("동아리를 찾을 수 없습니다.");
      return;
    }

    const slotDate = date.toISOString().split("T")[0];
    addLocalInterviewSlot({
      id: `local-${clubId}-${Date.now()}`,
      clubId: club.id,
      date: slotDate,
      startTime,
      endTime: calculateEndTime(startTime, durationValue),
      duration: durationValue,
      capacity: capacityValue,
      location,
      currentCount: 0,
    });
    setSlotRefreshKey((prev) => prev + 1);
    toast.success("면접 일정이 등록되었습니다.");
    setDate(undefined);
    setStartTime("");
    setDuration("30");
    setCapacity("3");
    setLocation("");
  };

  const handleOpenConfirmDialog = (
    slotId: string,
    slotDate: string,
    slotTime: string,
    slotLocation: string
  ) => {
    if (selectedSlotId !== null) {
      return;
    }
    setPendingSlot({ id: slotId, date: slotDate, time: slotTime, location: slotLocation });
    setConfirmDialogOpen(true);
  };

  const handleConfirmApplySlot = () => {
    if (!pendingSlot || !user || !clubId) {
      return;
    }

    const slot = combinedSlots.find((item) => item.id === pendingSlot.id);
    if (!slot) {
      toast.error("선택한 면접 일정을 찾을 수 없습니다.");
      setPendingSlot(null);
      return;
    }

    const storedSlot =
      getLocalInterviewSlots(clubId).find((item) => item.id === slot.id) ??
      addLocalInterviewSlot(slot);

    if (storedSlot.currentCount >= storedSlot.capacity) {
      toast.error("이미 마감된 일정입니다.");
      return;
    }

    const booked = bookInterviewSlot(storedSlot.id, user.id);
    if (!booked) {
      toast.error("면접 신청에 실패했습니다.");
      return;
    }

    const userApplication = getApplicationsForUser(user.id).find(
      (application) => application.clubId === clubId
    );
    if (userApplication) {
      assignInterviewSlot(userApplication.id, storedSlot);
    }

    setSlotRefreshKey((prev) => prev + 1);
    setSelectedSlotId(pendingSlot.id);
    setConfirmDialogOpen(false);
    setPendingSlot(null);
    toast.success("면접 신청이 완료되었습니다.");
  };

  const handleDeleteSlot = (slotId: string) => {
    if (!slotId) {
      return;
    }
    const removed = deleteLocalInterviewSlot(slotId);
    if (!removed) {
      toast.error("삭제할 면접 일정을 찾을 수 없습니다.");
      return;
    }
    setSlotRefreshKey((prev) => prev + 1);
    if (selectedSlotId === slotId) {
      setSelectedSlotId(null);
    }
    toast.success("면접 일정이 삭제되었습니다.");
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
        {isAdmin ? "동아리 관리자 페이지로" : "내 지원 현황으로"}
      </Button>

      <div className="mb-8">
        <h1 className="mb-2">
          {isAdmin ? "면접 일정 관리" : "면접 일정 신청"}
        </h1>
        <p className="text-gray-600">
          {club.name} - {isAdmin ? "면접을 등록하고 관리하세요" : "희망 일정에 신청해주세요"}
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${isAdmin ? "lg:grid-cols-2" : ""}`}>
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>새 면접 일정 생성</CardTitle>
            </CardHeader>
            <CardContent>
              <InterviewSlotForm
                date={date}
                startTime={startTime}
                duration={duration}
                capacity={capacity}
                location={location}
                onDateChange={setDate}
                onStartTimeChange={setStartTime}
                onDurationChange={setDuration}
                onCapacityChange={setCapacity}
                onLocationChange={setLocation}
                onSubmit={handleCreateSlot}
              />
            </CardContent>
          </Card>
        )}

        <Card className={isAdmin ? "" : "lg:col-span-1"}>
          <CardHeader>
            <CardTitle>
              {isAdmin ? "등록된 면접 일정" : "신청 가능한 면접 일정"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InterviewSlotList
              slots={combinedSlots}
              isAdmin={isAdmin}
              selectedSlotId={selectedSlotId}
              onSelectSlot={(slot) =>
                handleOpenConfirmDialog(
                  slot.id,
                  slot.date,
                  slot.startTime,
                  slot.location
                )
              }
              onDeleteSlot={handleDeleteSlot}
            />
          </CardContent>
        </Card>
      </div>

      <InterviewApplyDialog
        open={confirmDialogOpen}
        slotInfo={
          pendingSlot
            ? {
                date: pendingSlot.date,
                time: pendingSlot.time,
                location: pendingSlot.location,
              }
            : null
        }
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

import type { InterviewSlot } from "../../types/interview";
import { InterviewSlotCard } from "./InterviewSlotCard";

interface InterviewSlotListProps {
  slots: InterviewSlot[];
  isAdmin: boolean;
  selectedSlotId: string | null;
  onSelectSlot: (slot: InterviewSlot) => void;
}

export function InterviewSlotList({
  slots,
  isAdmin,
  selectedSlotId,
  onSelectSlot,
}: InterviewSlotListProps) {
  if (slots.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        {isAdmin ? (
          <>
            <p className="mb-2">아직 생성된 면접 일정이 없습니다.</p>
            <p>왼쪽 폼에서 면접 일정을 생성해주세요.</p>
          </>
        ) : (
          <>
            <p className="mb-2">아직 면접 일정이 생성되지 않았습니다.</p>
            <p>동아리에서 곧 일정을 공지할 예정입니다.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {slots.map((slot) => (
        <InterviewSlotCard
          key={slot.id}
          slot={slot}
          isAdmin={isAdmin}
          isSelected={selectedSlotId === slot.id}
          applyDisabled={selectedSlotId !== null}
          onSelect={onSelectSlot}
        />
      ))}
    </div>
  );
}


import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";

import type { InterviewSlot } from "../../types/interview";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

interface InterviewSlotCardProps {
  slot: InterviewSlot;
  isAdmin: boolean;
  isSelected: boolean;
  applyDisabled: boolean;
  onSelect?: (slot: InterviewSlot) => void;
}

export function InterviewSlotCard({
  slot,
  isAdmin,
  isSelected,
  applyDisabled,
  onSelect,
}: InterviewSlotCardProps) {
  const isFull = slot.currentCount >= slot.capacity;

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        isSelected ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span>{slot.date}</span>
        </div>
        <Badge
          variant={isFull ? "outline" : "default"}
          className={isFull ? "border-gray-400 text-gray-600" : "bg-green-600"}
        >
          {isFull ? "마감" : "신청가능"}
        </Badge>
      </div>

      <div className="mb-3 space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            {slot.startTime} - {slot.endTime} ({slot.duration}분)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>
            {slot.currentCount} / {slot.capacity}명 {isAdmin ? "신청" : ""}
          </span>
        </div>
      </div>

      {!isAdmin && (
        <Button
          className="w-full"
          size="sm"
          variant={isFull ? "outline" : "default"}
          disabled={isFull || applyDisabled}
          onClick={() => onSelect?.(slot)}
        >
          {isFull ? "마감됨" : isSelected ? "신청 완료" : "신청하기"}
        </Button>
      )}
    </div>
  );
}


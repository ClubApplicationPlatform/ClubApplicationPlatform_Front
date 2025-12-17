import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

interface InterviewSlotFormProps {
  date: Date | undefined;
  startTime: string;
  duration: string;
  capacity: string;
  location: string;
  onDateChange: (date: Date | undefined) => void;
  onStartTimeChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onCapacityChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSubmit: () => void;
}

export function InterviewSlotForm({
  date,
  startTime,
  duration,
  capacity,
  location,
  onDateChange,
  onStartTimeChange,
  onDurationChange,
  onCapacityChange,
  onLocationChange,
  onSubmit,
}: InterviewSlotFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>날짜</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start hover:cursor-pointer"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "날짜 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startTime">시작 시간</Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(event) => onStartTimeChange(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">면접 소요 시간 (분)</Label>
        <Input
          id="duration"
          type="number"
          value={duration}
          min="15"
          step="15"
          onChange={(event) => onDurationChange(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">참여 가능 인원</Label>
        <Input
          id="capacity"
          type="number"
          value={capacity}
          min="1"
          onChange={(event) => onCapacityChange(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">면접 장소</Label>
        <Input
          id="location"
          type="text"
          value={location}
          placeholder="ex) 3층 인재관 301호"
          onChange={(event) => onLocationChange(event.target.value)}
        />
      </div>

      <Button onClick={onSubmit} className="w-full hover:cursor-pointer">
        <Plus className="mr-2 h-4 w-4" />
        면접 일정 등록
      </Button>
    </div>
  );
}

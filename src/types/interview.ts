export interface InterviewSlot {
  id: string;
  clubId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  capacity: number;
  currentCount: number;
  location: string;
}

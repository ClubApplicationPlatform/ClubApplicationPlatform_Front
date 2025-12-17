import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Clock, Calendar as CalendarIcon, MapPin } from "lucide-react";

interface InterviewApplyDialogProps {
  open: boolean;
  slotInfo: { date: string; time: string; location?: string } | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function InterviewApplyDialog({
  open,
  slotInfo,
  onOpenChange,
  onConfirm,
  onCancel,
}: InterviewApplyDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[min(80vw,480px)]">
        <AlertDialogHeader>
          <AlertDialogTitle>면접 일정 신청 확인</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <div>선택한 면접 일정을 신청하시겠습니까?</div>
              {slotInfo && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-900">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="font-medium">{slotInfo.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{slotInfo.time}</span>
                    </div>
                    {slotInfo.location && (
                      <div className="flex items-center gap-2 text-gray-900">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{slotInfo.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="text-xs text-yellow-600">
                ※ 면접 일정은 신청 후 변경이 어려우니 신중히 선택해주세요.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            확인 및 신청
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

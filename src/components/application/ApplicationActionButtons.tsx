import { Button } from "../../ui/button";

interface ApplicationActionButtonsProps {
  onOpenClub: () => void;
  onOpenApplication: () => void;
}

export function ApplicationActionButtons({
  onOpenClub,
  onOpenApplication,
}: ApplicationActionButtonsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button variant="outline" onClick={onOpenClub} className="sm:flex-1">
        동아리 페이지
      </Button>
      <Button
        variant="outline"
        onClick={onOpenApplication}
        className="sm:flex-1"
      >
        지원서 보기
      </Button>
    </div>
  );
}


import type { Notice } from "../../types/notice";
import { NoticeCard } from "./NoticeCard";

interface NoticeListProps {
  notices: Notice[];
}

export function NoticeList({ notices }: NoticeListProps) {
  if (notices.length === 0) {
    return <p className="text-center text-gray-500">등록된 공지사항이 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      {notices.map((notice) => (
        <NoticeCard key={notice.id} notice={notice} />
      ))}
    </div>
  );
}


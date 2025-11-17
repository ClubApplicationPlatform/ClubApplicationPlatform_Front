import { NoticeList } from "../../components/notice/NoticeList";
import { siteNotices } from "../../lib/siteNotices";

export function NoticePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">공지사항</h1>
        <p className="text-gray-600">중요한 소식을 확인하세요</p>
      </div>

      <NoticeList notices={siteNotices} />
    </div>
  );
}


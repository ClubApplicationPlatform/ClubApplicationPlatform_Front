import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Badge } from "../../ui/badge";
import type { Notice } from "../../types/notice";
import {
  getLocalNoticesForClub,
  saveLocalNoticesForClub,
  LOCAL_NOTICES_EVENT,
} from "../../lib/localNotices";

interface ClubNoticesTabProps {
  clubId: string;
  initialNotices: Notice[];
}

export function ClubNoticesTab({ clubId, initialNotices }: ClubNoticesTabProps) {
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);

  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editNoticeTitle, setEditNoticeTitle] = useState("");
  const [editNoticeContent, setEditNoticeContent] = useState("");
  const [editNoticeImportant, setEditNoticeImportant] = useState(false);

  const [notices, setNotices] = useState<Notice[]>(() => {
    const stored = getLocalNoticesForClub(clubId);
    return stored.length ? stored : initialNotices;
  });

  const displayedNotices = notices.length ? notices : initialNotices;

  useEffect(() => {
    if (getLocalNoticesForClub(clubId).length === 0) {
      setNotices(initialNotices);
    }
  }, [clubId, initialNotices]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handler = () => {
      const stored = getLocalNoticesForClub(clubId);
      setNotices(stored.length ? stored : initialNotices);
    };
    window.addEventListener(LOCAL_NOTICES_EVENT, handler);
    return () => window.removeEventListener(LOCAL_NOTICES_EVENT, handler);
  }, [clubId, initialNotices]);

  const persistNotices = (nextNotices: Notice[]) => {
    setNotices(nextNotices);
    saveLocalNoticesForClub(clubId, nextNotices);
  };

  const handleAddNotice = () => {
    if (!noticeTitle.trim()) {
      toast.error("공지사항 제목을 입력해주세요.");
      return;
    }
    if (!noticeContent.trim()) {
      toast.error("공지사항 내용을 입력해주세요.");
      return;
    }

    const newNotice: Notice = {
      id: `local-${Date.now()}`,
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      date: new Date().toISOString().split("T")[0],
      isImportant,
    };

    const next = [...displayedNotices, newNotice];
    persistNotices(next);
    toast.success("공지사항이 등록되었습니다.");
    setNoticeTitle("");
    setNoticeContent("");
    setIsImportant(false);
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setEditNoticeTitle(notice.title);
    setEditNoticeContent(notice.content);
    setEditNoticeImportant(notice.isImportant);
  };

  const handleSaveEditNotice = () => {
    if (!editingNotice) {
      return;
    }
    if (!editNoticeTitle.trim()) {
      toast.error("공지사항 제목을 입력해주세요.");
      return;
    }
    if (!editNoticeContent.trim()) {
      toast.error("공지사항 내용을 입력해주세요.");
      return;
    }

    const next = displayedNotices.map((notice) =>
      notice.id === editingNotice.id
        ? {
            ...notice,
            title: editNoticeTitle.trim(),
            content: editNoticeContent.trim(),
            isImportant: editNoticeImportant,
          }
        : notice
    );
    persistNotices(next);
    toast.success("공지사항이 수정되었습니다.");
    handleCancelEditNotice();
  };

  const handleCancelEditNotice = () => {
    setEditingNotice(null);
    setEditNoticeTitle("");
    setEditNoticeContent("");
    setEditNoticeImportant(false);
  };

  const handleDeleteNotice = (noticeId: string) => {
    persistNotices(displayedNotices.filter((notice) => notice.id !== noticeId));
    toast.success("공지사항이 삭제되었습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>공지사항 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3>등록된 공지사항</h3>
          {displayedNotices.length ? (
            <div className="space-y-3">
              {displayedNotices.map((notice) => (
                <div key={notice.id} className="rounded-lg border p-4">
                  {editingNotice?.id === notice.id ? (
                    <div className="space-y-4">
                      <Input
                        placeholder="제목"
                        value={editNoticeTitle}
                        onChange={(e) => setEditNoticeTitle(e.target.value)}
                      />
                      <Textarea
                        placeholder="내용"
                        value={editNoticeContent}
                        onChange={(e) => setEditNoticeContent(e.target.value)}
                        rows={6}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-important-${notice.id}`}
                          checked={editNoticeImportant}
                          onCheckedChange={(checked) =>
                            setEditNoticeImportant(checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`edit-important-${notice.id}`}
                          className="cursor-pointer text-sm"
                        >
                          중요 공지사항으로 표시
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEditNotice}
                          className="flex-1"
                        >
                          저장
                        </Button>
                        <Button
                          onClick={handleCancelEditNotice}
                          variant="outline"
                          className="flex-1"
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {notice.isImportant && (
                            <Badge className="bg-red-600">중요</Badge>
                          )}
                          <h3>{notice.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {notice.date}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:cursor-pointer"
                            onClick={() => handleEditNotice(notice)}
                          >
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="hover:cursor-pointer"
                            size="icon"
                            onClick={() => handleDeleteNotice(notice.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-gray-600">
                        {notice.content}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border p-8 text-center text-gray-500">
              등록된 공지사항이 없습니다.
            </div>
          )}
        </div>

        <div className="space-y-4 border-t pt-6">
          <h3>새 공지사항 작성</h3>

          <div className="space-y-2">
            <Label htmlFor="noticeTitle">제목</Label>
            <Input
              id="noticeTitle"
              placeholder="공지사항 제목을 입력하세요"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="noticeContent">내용</Label>
            <Textarea
              id="noticeContent"
              placeholder="공지사항 내용을 입력하세요"
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              rows={6}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isImportant"
              className="hover:cursor-pointer"
              checked={isImportant}
              onCheckedChange={(checked) => setIsImportant(checked as boolean)}
            />
            <Label htmlFor="isImportant" className="cursor-pointer text-sm">
              중요 공지사항으로 표시
            </Label>
          </div>

          <Button onClick={handleAddNotice} className="w-full hover:cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            공지사항 등록
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

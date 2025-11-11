import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Badge } from "../../ui/badge";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Users,
  ClipboardList,
  Bell,
  Edit2,
  GripVertical,
} from "lucide-react";
import {
  mockClubs,
  mockQuestions,
  mockApplications,
  mockInterviewSlots,
} from "../../lib/mockData";
import { toast } from "sonner";
import { format } from "date-fns";
import { Checkbox } from "../../ui/checkbox";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ClubManagerPageProps {
  user: any;
}

interface SortableQuestionItemProps {
  question: any;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (question: any) => void;
}

function SortableQuestionItem({
  question,
  index,
  onDelete,
  onEdit,
}: SortableQuestionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2 rounded-lg border bg-white p-4"
    >
      <button
        className="cursor-grab active:cursor-grabbing mt-1"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </button>
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <Badge>Q{index + 1}</Badge>
          <span className="text-sm text-gray-500">
            질문 {question.question.length}/300자, 답변 최대{" "}
            {question.maxLength}자
          </span>
        </div>
        <p className="text-gray-700">{question.question}</p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={() => onEdit(question)}>
          <Edit2 className="h-4 w-4 text-blue-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(question.id)}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
}

export function ClubManagerPage({ user }: ClubManagerPageProps) {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const club = mockClubs.find((c) => c.id === clubId);
  const [questionsList, setQuestionsList] = useState(
    mockQuestions.filter((q) => q.clubId === clubId)
  );
  const applications = mockApplications.filter((a) => a.clubId === clubId);
  const interviewSlots = mockInterviewSlots.filter(
    (slot) => slot.clubId === clubId
  );

  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionMaxLength, setNewQuestionMaxLength] = useState("500");
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editQuestionMaxLength, setEditQuestionMaxLength] = useState("500");

  const [deadline, setDeadline] = useState<Date | undefined>(
    club?.recruitDeadline ? new Date(club.recruitDeadline) : undefined
  );

  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [editNoticeTitle, setEditNoticeTitle] = useState("");
  const [editNoticeContent, setEditNoticeContent] = useState("");
  const [editNoticeImportant, setEditNoticeImportant] = useState(false);

  const [notifyApplicants, setNotifyApplicants] = useState(false);

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

  // 관리자 권한 확인
  if (club.adminId !== user.id) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-2">접근 권한이 없습니다.</p>
            <p className="text-sm text-gray-600">
              이 동아리의 관리자만 설정 페이지에 접근할 수 있습니다.
            </p>
            <Button
              onClick={() => navigate(`/clubs/${clubId}`)}
              className="mt-4"
            >
              동아리 페이지로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error("질문을 입력해주세요.");
      return;
    }

    if (newQuestion.length > 300) {
      toast.error("질문은 최대 300자까지 입력 가능합니다.");
      return;
    }

    const maxLen = parseInt(newQuestionMaxLength);
    if (isNaN(maxLen) || maxLen < 100 || maxLen > 1000) {
      toast.error("답변 글자 수는 100자에서 1000자 사이여야 합니다.");
      return;
    }

    const newQ = {
      id: `q-${Date.now()}`,
      clubId: clubId!,
      question: newQuestion,
      order: questionsList.length + 1,
      maxLength: maxLen,
    };

    setQuestionsList([...questionsList, newQ]);
    toast.success("질문이 추가되었습니다.");
    setNewQuestion("");
    setNewQuestionMaxLength("500");
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestionsList(questionsList.filter((q) => q.id !== questionId));
    toast.success("질문이 삭제되었습니다.");
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setEditQuestionText(question.question);
    setEditQuestionMaxLength(question.maxLength.toString());
  };

  const handleSaveEditQuestion = () => {
    if (!editQuestionText.trim()) {
      toast.error("질문을 입력해주세요.");
      return;
    }

    if (editQuestionText.length > 300) {
      toast.error("질문은 최대 300자까지 입력 가능합니다.");
      return;
    }

    const maxLen = parseInt(editQuestionMaxLength);
    if (isNaN(maxLen) || maxLen < 100 || maxLen > 1000) {
      toast.error("답변 글자 수는 100자에서 1000자 사이여야 합니다.");
      return;
    }

    setQuestionsList(
      questionsList.map((q) =>
        q.id === editingQuestion.id
          ? { ...q, question: editQuestionText, maxLength: maxLen }
          : q
      )
    );
    toast.success("질문이 수정되었습니다.");
    setEditingQuestion(null);
    setEditQuestionText("");
    setEditQuestionMaxLength("500");
  };

  const handleCancelEditQuestion = () => {
    setEditingQuestion(null);
    setEditQuestionText("");
    setEditQuestionMaxLength("500");
  };

  const handleSetDeadline = () => {
    if (!deadline) {
      toast.error("날짜를 선택해주세요.");
      return;
    }
    toast.success("신청 마감일이 설정되었습니다.");
  };

  const handleCloseRecruitment = () => {
    toast.success("모집이 종료되었습니다.");
  };

  const handleStartRecruitment = () => {
    if (!deadline) {
      toast.error("먼저 신청 마감일을 설정해주세요.");
      return;
    }
    toast.success("모집이 시작되었습니다.");
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
    toast.success("공지사항이 등록되었습니다.");
    setNoticeTitle("");
    setNoticeContent("");
    setIsImportant(false);
  };

  const handleEditNotice = (notice: any) => {
    setEditingNotice(notice);
    setEditNoticeTitle(notice.title);
    setEditNoticeContent(notice.content);
    setEditNoticeImportant(notice.isImportant);
  };

  const handleSaveEditNotice = () => {
    if (!editNoticeTitle.trim()) {
      toast.error("공지사항 제목을 입력해주세요.");
      return;
    }
    if (!editNoticeContent.trim()) {
      toast.error("공지사항 내용을 입력해주세요.");
      return;
    }
    toast.success("공지사항이 수정되었습니다.");
    setEditingNotice(null);
    setEditNoticeTitle("");
    setEditNoticeContent("");
    setEditNoticeImportant(false);
  };

  const handleCancelEditNotice = () => {
    setEditingNotice(null);
    setEditNoticeTitle("");
    setEditNoticeContent("");
    setEditNoticeImportant(false);
  };

  const handleDeleteNotice = (noticeId: string) => {
    toast.success("공지사항이 삭제되었습니다.");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-700"
          >
            검토중
          </Badge>
        );
      case "document_passed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            서류 합격
          </Badge>
        );
      case "interview_scheduled":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            면접 예정
          </Badge>
        );
      case "accepted":
        return <Badge className="bg-green-600">합격</Badge>;
      case "rejected":
        return (
          <Badge variant="outline" className="border-gray-400 text-gray-600">
            불합격
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questionsList.findIndex((q) => q.id === active.id);
      const newIndex = questionsList.findIndex((q) => q.id === over.id);

      const newQuestions = arrayMove(questionsList, oldIndex, newIndex);
      setQuestionsList(newQuestions);
      toast.success("질문 순서가 변경되었습니다.");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2">{club.name} 관리</h1>
        <p className="text-gray-600">동아리 모집 및 신청자를 관리하세요</p>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="applications" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            신청자 관리
          </TabsTrigger>
          <TabsTrigger value="notices" className="gap-2">
            <Bell className="h-4 w-4" />
            공지사항
          </TabsTrigger>
          <TabsTrigger value="questions" className="gap-2">
            <Users className="h-4 w-4" />
            질문 설정
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            모집 설정
          </TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>신청자 목록</CardTitle>
                <Badge variant="outline">총 {applications.length}명</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3>{application.applicantName}</h3>
                        {getStatusBadge(application.status)}
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{application.studentId}</span>
                        <span>{application.department}</span>
                        <span>{application.phone}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        지원일: {application.appliedAt}
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        navigate(`/applications/${application.id}`)
                      }
                    >
                      상세보기
                    </Button>
                  </div>
                ))}

                {applications.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    아직 지원자가 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notices Tab */}
        <TabsContent value="notices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>공지사항 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 기존 공지사항 목록 */}
              <div className="space-y-4">
                <h3>등록된 공지사항</h3>
                {club.notices && club.notices.length > 0 ? (
                  <div className="space-y-3">
                    {club.notices.map((notice) => (
                      <div key={notice.id} className="rounded-lg border p-4">
                        {editingNotice?.id === notice.id ? (
                          <div className="space-y-4">
                            <Input
                              placeholder="제목"
                              value={editNoticeTitle}
                              onChange={(e) =>
                                setEditNoticeTitle(e.target.value)
                              }
                            />
                            <Textarea
                              placeholder="내용"
                              value={editNoticeContent}
                              onChange={(e) =>
                                setEditNoticeContent(e.target.value)
                              }
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
                                  onClick={() => handleEditNotice(notice)}
                                >
                                  <Edit2 className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
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

              {/* 새 공지사항 작성 */}
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
                    checked={isImportant}
                    onCheckedChange={(checked) =>
                      setIsImportant(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="isImportant"
                    className="cursor-pointer text-sm"
                  >
                    중요 공지사항으로 표시
                  </Label>
                </div>

                <Button onClick={handleAddNotice} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  공지사항 등록
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>지원 질문 관리</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                질문을 드래그하여 순서를 변경할 수 있습니다
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {editingQuestion ? (
                <div className="rounded-lg border border-blue-500 bg-blue-50 p-4 space-y-4">
                  <h3 className="text-blue-900">질문 수정</h3>
                  <div className="space-y-2">
                    <Label htmlFor="editQuestion">질문 내용</Label>
                    <Input
                      id="editQuestion"
                      placeholder="질문을 입력하세요 (최대 300자)"
                      value={editQuestionText}
                      onChange={(e) => setEditQuestionText(e.target.value)}
                      maxLength={300}
                    />
                    <p className="text-sm text-gray-500">
                      {editQuestionText.length} / 300자
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editMaxLength">
                      답변 최대 글자 수 (100-1000)
                    </Label>
                    <Input
                      id="editMaxLength"
                      type="number"
                      placeholder="500"
                      value={editQuestionMaxLength}
                      onChange={(e) => setEditQuestionMaxLength(e.target.value)}
                      min="100"
                      max="1000"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEditQuestion} className="flex-1">
                      저장
                    </Button>
                    <Button
                      onClick={handleCancelEditQuestion}
                      variant="outline"
                      className="flex-1"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : null}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={questionsList.map((q) => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {questionsList.map((question, index) => (
                      <SortableQuestionItem
                        key={question.id}
                        question={question}
                        index={index}
                        onDelete={handleDeleteQuestion}
                        onEdit={handleEditQuestion}
                      />
                    ))}
                    {questionsList.length === 0 && (
                      <div className="rounded-lg border p-8 text-center text-gray-500">
                        등록된 질문이 없습니다. 새 질문을 추가해보세요.
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="space-y-3 border-t pt-6">
                <h3>새 질문 추가</h3>
                <div className="space-y-2">
                  <Label htmlFor="newQuestion">질문 내용</Label>
                  <Input
                    id="newQuestion"
                    placeholder="질문을 입력하세요 (최대 300자)"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    maxLength={300}
                  />
                  <p className="text-sm text-gray-500">
                    {newQuestion.length} / 300자
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newMaxLength">
                    답변 최대 글자 수 (100-1000)
                  </Label>
                  <Input
                    id="newMaxLength"
                    type="number"
                    placeholder="500"
                    value={newQuestionMaxLength}
                    onChange={(e) => setNewQuestionMaxLength(e.target.value)}
                    min="100"
                    max="1000"
                  />
                  <p className="text-sm text-gray-500">
                    지원자가 답변을 작성할 때 최대 글자 수를 제한합니다
                  </p>
                </div>
                <Button onClick={handleAddQuestion} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  질문 추가
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>모집 상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="mb-1">현재 상태</h3>
                    <p className="text-sm text-gray-600">
                      {club.isRecruiting
                        ? "모집 중입니다"
                        : "모집이 종료되었습니다"}
                    </p>
                  </div>
                  <Badge
                    className={
                      club.isRecruiting ? "bg-green-600" : "bg-gray-400"
                    }
                  >
                    {club.isRecruiting ? "모집중" : "모집 마감"}
                  </Badge>
                </div>

                {club.isRecruiting ? (
                  <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4">
                    <div>
                      <h3 className="mb-1 text-red-900">모집 종료</h3>
                      <p className="text-sm text-red-700">
                        모집을 종료하면 더 이상 지원을 받을 수 없습니다.
                        신중하게 결정해주세요.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notifyApplicants"
                        checked={notifyApplicants}
                        onCheckedChange={(checked) =>
                          setNotifyApplicants(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="notifyApplicants"
                        className="cursor-pointer text-sm text-red-900"
                      >
                        지원자에게 알림 보내기
                      </Label>
                    </div>
                    <Button
                      onClick={handleCloseRecruitment}
                      variant="destructive"
                      className="w-full"
                    >
                      모집 종료하기
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-4">
                    <div>
                      <h3 className="mb-1 text-green-900">모집 시작</h3>
                      <p className="text-sm text-green-700">
                        신청 마감일을 설정한 후 모집을 시작할 수 있습니다.
                        {!deadline && " 먼저 아래에서 마감일을 설정해주세요."}
                      </p>
                    </div>
                    <Button
                      onClick={handleStartRecruitment}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      모집 시작하기
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>신청 마감일 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>마감일</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, "PPP") : "날짜 선택"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={handleSetDeadline} className="w-full">
                  마감일 저장
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>면접 일정 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate(`/clubs/${clubId}/interview`)}
                  className="w-full"
                >
                  면접 일정 설정하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

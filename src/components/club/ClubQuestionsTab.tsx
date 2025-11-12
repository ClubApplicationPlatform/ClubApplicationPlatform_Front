import { useMemo, useState } from "react";
import { Plus, Trash2, Edit2, GripVertical } from "lucide-react";
import { toast } from "sonner";
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

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

export interface ClubQuestion {
  id: string;
  clubId: string;
  question: string;
  order: number;
  maxLength: number;
}

interface ClubQuestionsTabProps {
  clubId: string;
  initialQuestions: ClubQuestion[];
}

export function ClubQuestionsTab({
  clubId,
  initialQuestions,
}: ClubQuestionsTabProps) {
  const [questionsList, setQuestionsList] = useState<ClubQuestion[]>(
    () => initialQuestions ?? []
  );
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionMaxLength, setNewQuestionMaxLength] = useState("500");

  const [editingQuestion, setEditingQuestion] = useState<ClubQuestion | null>(
    null
  );
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editQuestionMaxLength, setEditQuestionMaxLength] = useState("500");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error("질문을 입력해주세요.");
      return;
    }

    if (newQuestion.length > 300) {
      toast.error("질문은 최대 300자까지 입력 가능합니다.");
      return;
    }

    const maxLen = parseInt(newQuestionMaxLength, 10);
    if (isNaN(maxLen) || maxLen < 100 || maxLen > 1000) {
      toast.error("답변 글자수는 100자에서 1000자 사이여야 합니다.");
      return;
    }

    const newQuestionItem: ClubQuestion = {
      id: `q-${Date.now()}`,
      clubId,
      question: newQuestion,
      order: questionsList.length + 1,
      maxLength: maxLen,
    };

    setQuestionsList([...questionsList, newQuestionItem]);
    toast.success("질문이 추가되었습니다.");
    setNewQuestion("");
    setNewQuestionMaxLength("500");
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestionsList(questionsList.filter((q) => q.id !== questionId));
    toast.success("질문이 삭제되었습니다.");
  };

  const handleEditQuestion = (question: ClubQuestion) => {
    setEditingQuestion(question);
    setEditQuestionText(question.question);
    setEditQuestionMaxLength(question.maxLength.toString());
  };

  const handleSaveEditQuestion = () => {
    if (!editingQuestion) {
      return;
    }

    if (!editQuestionText.trim()) {
      toast.error("질문을 입력해주세요.");
      return;
    }

    if (editQuestionText.length > 300) {
      toast.error("질문은 최대 300자까지 입력 가능합니다.");
      return;
    }

    const maxLen = parseInt(editQuestionMaxLength, 10);
    if (isNaN(maxLen) || maxLen < 100 || maxLen > 1000) {
      toast.error("답변 글자수는 100자에서 1000자 사이여야 합니다.");
      return;
    }

    setQuestionsList((prev) =>
      prev.map((q) =>
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

  const sortedQuestionIds = useMemo(
    () => questionsList.map((q) => q.id),
    [questionsList]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>지원서 질문 관리</CardTitle>
        <p className="mt-2 text-sm text-gray-600">질문을 드래그해서 순서를 변경할 수 있어요.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {editingQuestion ? (
          <div className="space-y-4 rounded-lg border border-blue-500 bg-blue-50 p-4">
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
              <p className="text-sm text-gray-500">{editQuestionText.length} / 300자</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editMaxLength">답변 최대 글자수 (100-1000)</Label>
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
          <SortableContext items={sortedQuestionIds} strategy={verticalListSortingStrategy}>
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
            <p className="text-sm text-gray-500">{newQuestion.length} / 300자</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newMaxLength">답변 최대 글자수 (100-1000)</Label>
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
              지원자가 답변을 작성할 때의 최대 글자수 제한입니다.
            </p>
          </div>
          <Button onClick={handleAddQuestion} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            질문 추가
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface SortableQuestionItemProps {
  question: ClubQuestion;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (question: ClubQuestion) => void;
}

function SortableQuestionItem({
  question,
  index,
  onDelete,
  onEdit,
}: SortableQuestionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: question.id,
  });

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
        className="mt-1 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </button>
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <Badge>Q{index + 1}</Badge>
          <span className="text-sm text-gray-500">
            질문 {question.question.length}/300자 · 최대 {question.maxLength}자
          </span>
        </div>
        <p className="text-gray-700">{question.question}</p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={() => onEdit(question)}>
          <Edit2 className="h-4 w-4 text-blue-600" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(question.id)}>
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
}

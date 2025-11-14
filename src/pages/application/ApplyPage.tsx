import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { mockClubs, mockQuestions } from "../../lib/mockData";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Textarea } from "../../ui/textarea";

const MIN_ANSWER_LENGTH = 50;
const MAX_ANSWER_LENGTH = 300;

export function ApplyPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const club = mockClubs.find((entry) => entry.id === clubId);
  const questions = mockQuestions.filter((question) => question.clubId === clubId);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getCharCount = (questionId: string) => answers[questionId]?.length ?? 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = questions.filter(
      (question) => !answers[question.id] || answers[question.id].trim().length < MIN_ANSWER_LENGTH
    );

    if (invalid.length) {
      toast.error("모든 질문에 50자 이상 답변해주세요.");
      return;
    }

    toast.success("지원서가 제출되었습니다.");
    navigate("/my-page");
  };

  if (!club) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4">동아리를 찾을 수 없습니다.</p>
            <Button onClick={() => navigate("/clubs")}>동아리 목록으로 이동</Button>
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
            <p className="mb-4">로그인이 필요합니다.</p>
            <Button onClick={() => navigate("/login")}>로그인 하러 가기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate(`/clubs/${clubId}`)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로가기
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-semibold text-gray-900">지원서 작성</h1>
              <p className="text-gray-600">{club.name}</p>
            </div>
            <Badge variant="outline" className="text-sm">
              임시 저장 가능
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <motion.div
          className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
            <div className="text-sm text-blue-900">
              <p className="mb-1 font-medium">지원서 작성 안내</p>
              <ul className="list-inside list-disc space-y-1 text-blue-800">
                <li>각 질문당 최대 {MAX_ANSWER_LENGTH}자까지 입력 가능합니다.</li>
                <li>제출 후에는 수정이 불가능하니 신중하게 작성해주세요.</li>
                <li>
                  마감일: <span className="font-semibold">{club.recruitDeadline}</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-16">
          {questions.map((question, index) => {
            const count = getCharCount(question.id);
            const countColor =
              count > MAX_ANSWER_LENGTH
                ? "text-red-600"
                : count >= MIN_ANSWER_LENGTH
                  ? "text-green-600"
                  : "text-gray-500";
            return (
              <motion.div
                key={question.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="border-2">
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge className="bg-blue-600">Q{index + 1}</Badge>
                          <span className="text-sm text-gray-500">필수</span>
                        </div>
                        <CardTitle className="text-lg">{question.question}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Textarea
                        placeholder="답변을 입력해주세요..."
                        value={answers[question.id] ?? ""}
                        onChange={(event) => handleAnswerChange(question.id, event.target.value)}
                        className="min-h-[200px] resize-none"
                        maxLength={MAX_ANSWER_LENGTH}
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">최소 {MIN_ANSWER_LENGTH}자 이상 작성해주세요</span>
                        <span className={countColor}>
                          {count} / {MAX_ANSWER_LENGTH}자
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          <div className="sticky bottom-0 flex gap-3 border-t bg-white p-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => toast.success("임시 저장되었습니다.")}
            >
              임시 저장
            </Button>
            <Button type="submit" className="flex-1">
              제출하기
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

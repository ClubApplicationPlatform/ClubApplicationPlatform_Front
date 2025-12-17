import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import type { Application, ApplicationAnswer } from "../../types/application";
import type { ClubQuestion } from "../../types/question";
import { addLocalApplication } from "../../lib/localApplications";
import { mockClubs, mockQuestions } from "../../lib/mockData";
import {
  getLocalQuestionsForClub,
  LOCAL_QUESTIONS_EVENT,
} from "../../lib/localQuestions";
import { useAuthStore } from "../../stores/authStore";
import { useActiveCampus } from "../../hooks/useActiveCampus";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Textarea } from "../../ui/textarea";
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

const MAX_ANSWER_LENGTH = 300;
const QUESTIONS_ENDPOINT = (clubId: string) =>
  `https://clubapplicationplatform-server.onrender.com/clubs/${clubId}/questions`;

export function ApplyPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const campus = useActiveCampus();

  const club = mockClubs.find((entry) => entry.id === clubId);
  const defaultQuestions = useMemo(
    () => mockQuestions.filter((question) => question.clubId === clubId),
    [clubId]
  );
  const [questions, setQuestions] = useState<ClubQuestion[]>(() => {
    if (!clubId) {
      return [];
    }
    const stored = getLocalQuestionsForClub(clubId);
    return stored.length ? stored : defaultQuestions;
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchQuestions = async () => {
      if (!clubId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const storedBefore = getLocalQuestionsForClub(clubId);
      if (storedBefore.length) {
        setQuestions(storedBefore);
      } else {
        setQuestions(defaultQuestions);
      }
      try {
        const response = await fetch(QUESTIONS_ENDPOINT(clubId), {
          headers: { accept: "*/*" },
        });
        const body = (await response.json().catch(() => null)) as
          | {
              qid?: number | string;
              question?: string;
              active?: number;
              club?: { clubId?: number | string };
            }[]
          | null;

        const ok = response.ok && Array.isArray(body);
        if (!ok || !body) {
          throw new Error("Failed to load questions");
        }

        const mapped = body
          .filter((item) => item?.active !== 0)
          .map((item) => ({
            id: String(item?.qid ?? crypto.randomUUID()),
            clubId: String(item?.club?.clubId ?? clubId),
            question: item?.question ?? "질문이 준비 중입니다.",
          }));

        if (!cancelled) {
          const storedAfter = getLocalQuestionsForClub(clubId);
          if (storedAfter.length === 0) {
            setQuestions(mapped);
          }
        }
      } catch (error) {
        console.error("질문 불러오기 실패, mock 데이터 사용", error);
        if (!cancelled) {
          setQuestions(defaultQuestions);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchQuestions();
    return () => {
      cancelled = true;
    };
  }, [clubId, defaultQuestions]);

  useEffect(() => {
    if (!clubId || typeof window === "undefined") {
      return;
    }
    const handler = () => {
      const stored = getLocalQuestionsForClub(clubId);
      if (stored.length) {
        setQuestions(stored);
      }
    };
    window.addEventListener(LOCAL_QUESTIONS_EVENT, handler);
    return () => window.removeEventListener(LOCAL_QUESTIONS_EVENT, handler);
  }, [clubId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getCharCount = (questionId: string) => answers[questionId]?.length ?? 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = questions.filter((question) => {
      const text = answers[question.id] ?? "";
      return text.trim().length === 0;
    });

    if (invalid.length) {
      toast.error("모든 질문에 답변을 입력해주세요.");
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    if (!club || !user) {
      setIsConfirmOpen(false);
      navigate("/clubs");
      return;
    }

    const answersPayload: ApplicationAnswer[] = questions.map((question) => ({
      question: question.question,
      answer: answers[question.id] ?? "",
    }));

    const applicationId =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${club.id}-${Date.now()}`;

    const newApplication: Application = {
      id: applicationId,
      clubId: club.id,
      clubName: club.name,
      applicantId: user.id,
      applicantName: user.nickname,
      studentId: user.email.split("@")[0] ?? user.id,
      department: club.department,
      phone: "",
      status: "pending",
      answers: answersPayload,
      appliedAt: new Date().toISOString().split("T")[0],
      interviewSlot: null,
    };

    addLocalApplication(newApplication);
    setIsConfirmOpen(false);
    navigate(clubId ? `/clubs/${clubId}/apply/success` : "/clubs");
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsConfirmOpen(open);
  };

  if (!club) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center hover:cursor-pointer">
            <p className="mb-4">동아리를 찾을 수 없습니다.</p>
            <Button onClick={() => navigate("/clubs")}>
              동아리 목록으로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (campus && club.campusId !== campus.id) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4">해당 학교 동아리에만 지원할 수 있어요.</p>
            <Button onClick={() => navigate("/clubs")}>다른 동아리 둘러보기</Button>
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
            <p className="mb-4">로그인이 필요해요.</p>
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
          <Button
            variant="ghost"
            onClick={() => navigate(`/clubs/${club.id}`)}
            className="mb-4 hover:cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로가기
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-semibold text-gray-900">
                지원서 작성
              </h1>
              <p className="text-gray-600">{club.name}</p>
            </div>
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
                <li>각 질문은 최대 {MAX_ANSWER_LENGTH}자까지 입력 가능합니다.</li>
                <li>제출 후에는 수정이 어려우니 신중하게 작성해주세요.</li>
                <li>
                  마감일{" "}
                  <span className="font-semibold">{club.recruitDeadline}</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-16">
          {isLoading ? (
            <Card>
              <CardContent className="py-10 text-center text-gray-600">
                질문을 불러오는 중입니다...
              </CardContent>
            </Card>
          ) : (
            questions.map((question, index) => {
              const count = getCharCount(question.id);
              const countColor =
                count > MAX_ANSWER_LENGTH ? "text-red-600" : "text-gray-500";
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
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                              Q{index + 1}
                            </span>
                            <span className="text-sm text-gray-500">필수</span>
                          </div>
                          <CardTitle className="text-lg">
                            {question.question}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <Textarea
                          placeholder="자유롭게 입력해주세요..."
                          value={answers[question.id] ?? ""}
                          onChange={(event) =>
                            handleAnswerChange(question.id, event.target.value)
                          }
                          className="min-h-[200px] resize-none"
                          maxLength={MAX_ANSWER_LENGTH}
                        />
                        <div className="flex justify-end text-sm">
                          <span className={countColor}>
                            {count} / {MAX_ANSWER_LENGTH}자
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}

          <div className="sticky bottom-0 flex gap-3 border-t bg-white p-4">
            <Button type="submit" className="flex-1 hover:cursor-pointer">
              제출하기
            </Button>
          </div>
        </form>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={handleDialogOpenChange}>
        <AlertDialogContent className="w-[min(90vw,420px)]">
          <AlertDialogHeader>
            <AlertDialogTitle>지원서를 제출할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              제출 후에는 더 이상 수정할 수 없습니다. 내용을 다시 한 번
              확인해주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:cursor-pointer">
              계속 작성
            </AlertDialogCancel>
            <AlertDialogAction
              className="hover:cursor-pointer"
              onClick={handleConfirmSubmit}
            >
              제출 확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

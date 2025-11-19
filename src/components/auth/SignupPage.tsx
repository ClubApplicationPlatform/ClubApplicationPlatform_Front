import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, CheckCircle, Clock } from "lucide-react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { useAuthStore } from "../../stores/authStore";
import {
  getSupportedEmailSuffixHint,
  matchCampusByEmail,
} from "../../lib/campuses";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

const EXPIRE_SECONDS = 180;
const RESEND_COOLDOWN = 60;
const STORAGE_KEY = "signup-email-code";

type StoredCode = {
  email: string;
  code: string;
  expiresAt: number;
  lastSentAt: number;
};

const loadStoredCode = (): StoredCode | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredCode) : null;
  } catch {
    return null;
  }
};

const saveStoredCode = (payload: StoredCode) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const clearStoredCode = () => sessionStorage.removeItem(STORAGE_KEY);

const generateCode = (len = 6) =>
  Math.floor(10 ** (len - 1) + Math.random() * 9 * 10 ** (len - 1)).toString();

const heroStyles: CSSProperties = {
  backgroundImage: "url('/assets/JoinUs_Background.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export function SignupPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const emailHint = useMemo(() => getSupportedEmailSuffixHint(), []);

  const [form, setForm] = useState({
    email: "",
    verificationCode: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    const stored = loadStoredCode();
    if (!stored) {
      return;
    }
    const remain = Math.max(0, Math.floor((stored.expiresAt - Date.now()) / 1000));
    if (remain > 0) {
      setForm((prev) => ({ ...prev, email: stored.email }));
      setIsCodeSent(true);
      setTimeLeft(remain);
    } else {
      clearStoredCode();
    }
  }, []);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => password.length >= 8;

  const handleSendVerificationCode = async () => {
    if (!form.email) {
      setErrors((prev) => ({ ...prev, email: "학교 이메일을 입력해 주세요." }));
      return;
    }
    if (!validateEmail(form.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아니에요.",
      }));
      return;
    }
    const campus = matchCampusByEmail(form.email);
    if (!campus) {
      setErrors((prev) => ({
        ...prev,
        email: `${emailHint} 도메인만 사용할 수 있어요.`,
      }));
      return;
    }

    const stored = loadStoredCode();
    if (stored && stored.email === form.email) {
      const since = Math.floor((Date.now() - stored.lastSentAt) / 1000);
      if (since < RESEND_COOLDOWN) {
        toast.error(`${RESEND_COOLDOWN - since}초 뒤에 다시 시도해 주세요.`);
        return;
      }
    }

    setIsSendingCode(true);
    try {
      const code = generateCode();
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { to_email: form.email, verification_code: code },
        EMAILJS_PUBLIC_KEY
      );
      saveStoredCode({
        email: form.email,
        code,
        expiresAt: Date.now() + EXPIRE_SECONDS * 1000,
        lastSentAt: Date.now(),
      });
      setIsCodeSent(true);
      setTimeLeft(EXPIRE_SECONDS);
      toast.success("인증번호를 전송했어요. 학교 메일함을 확인해 주세요.");
    } catch (error) {
      console.error(error);
      toast.error("인증번호 전송에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = () => {
    if (!form.verificationCode.trim()) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호를 입력해 주세요.",
      }));
      return;
    }
    const stored = loadStoredCode();
    if (!stored || stored.email !== form.email) {
      toast.error("인증번호를 다시 요청해 주세요.");
      return;
    }
    if (Date.now() > stored.expiresAt) {
      toast.error("인증 시간이 만료됐어요. 다시 요청해 주세요.");
      setTimeLeft(0);
      clearStoredCode();
      return;
    }
    if (stored.code === form.verificationCode.trim()) {
      setIsVerified(true);
      setTimeLeft(0);
      clearStoredCode();
      toast.success("학교 이메일 인증이 완료됐어요.");
    } else {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호가 일치하지 않아요.",
      }));
      toast.error("인증번호가 일치하지 않아요.");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!isVerified) {
      toast.error("학교 이메일 인증을 먼저 완료해 주세요.");
      return;
    }
    if (!validateEmail(form.email)) {
      nextErrors.email = "올바른 이메일 형식이 아니에요.";
    }
    const campus = matchCampusByEmail(form.email);
    if (!campus) {
      toast.error(`허용된 학교 이메일(${emailHint})을 다시 확인해 주세요.`);
      return;
    }
    if (!validatePassword(form.password)) {
      nextErrors.password = "비밀번호는 최소 8자 이상 입력해 주세요.";
    }
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "비밀번호가 일치하지 않아요.";
    }
    if (!form.nickname.trim()) {
      nextErrors.nickname = "닉네임을 입력해 주세요.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const user = {
      id: Date.now().toString(),
      email: form.email,
      nickname: form.nickname.trim(),
      role: "user" as const,
      campusId: campus.id,
    };

    toast.success(`${campus.name} 학생으로 가입되었어요.`);
    login(user);
    navigate("/clubs");
  };

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));

      if (field === "email") {
        setIsVerified(false);
        setIsCodeSent(false);
        setTimeLeft(0);
        clearStoredCode();
      }
    };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute inset-0" style={heroStyles} />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-800/60" />

      <div className="relative z-10 flex w-full max-w-2xl items-center justify-center">
        <Card className="w-full shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center">
              <img
                src="/assets/JoinUs_Logo.png"
                alt="JoinUs"
                className="h-10 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-semibold">회원가입</CardTitle>
            <CardDescription>
              학교 이메일 인증을 완료하고 나만의 캠퍼스 동아리 계정을 만들어
              보세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">학교 이메일</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="ex) user@st.yc.ac.kr 또는 user@gnu.ac.kr"
                    value={form.email}
                    onChange={handleChange("email")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0"
                    disabled={isSendingCode || timeLeft > 0}
                    onClick={handleSendVerificationCode}
                  >
                    {isSendingCode ? "전송 중..." : "인증 코드"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  사용 가능한 도메인: {emailHint}
                </p>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
                {isCodeSent && !isVerified && (
                  <p className="text-sm text-blue-600">
                    인증번호가 메일로 발송되었어요.
                  </p>
                )}
                {isVerified && (
                  <p className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    이메일 인증이 완료되었습니다.
                  </p>
                )}
              </div>

              {isCodeSent && !isVerified && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="space-y-2 rounded-lg border border-dashed border-blue-200 p-4"
                >
                  <Label htmlFor="verificationCode">인증번호</Label>
                  <div className="flex gap-2">
                    <Input
                      id="verificationCode"
                      maxLength={6}
                      value={form.verificationCode}
                      onChange={handleChange("verificationCode")}
                      placeholder="6자리 숫자를 입력해 주세요"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVerifyCode}
                      disabled={timeLeft === 0}
                    >
                      인증 확인
                    </Button>
                  </div>
                  {errors.verificationCode && (
                    <p className="text-sm text-red-600">
                      {errors.verificationCode}
                    </p>
                  )}
                  {timeLeft > 0 ? (
                    <p className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      남은 시간:{" "}
                      {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`}
                    </p>
                  ) : (
                    <p className="text-sm text-red-600">
                      인증 시간이 만료됐어요. 다시 요청해 주세요.
                    </p>
                  )}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  value={form.nickname}
                  onChange={handleChange("nickname")}
                  placeholder="닉네임을 입력해 주세요"
                />
                {errors.nickname && (
                  <p className="text-sm text-red-600">{errors.nickname}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="8자 이상 입력해 주세요"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="비밀번호를 한 번 더 입력해 주세요"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                회원가입
              </Button>

              <div className="text-center text-sm">
                이미 계정이 있나요?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  로그인
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

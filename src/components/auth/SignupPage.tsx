import { useEffect, useState, type CSSProperties } from "react";
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

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

const EXPIRE_SECONDS = 180;
const RESEND_COOLDOWN = 60;

type StoredCode = {
  email: string;
  code: string;
  expiresAt: number;
  lastSentAt: number;
};

export function SignupPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    verificationCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 8;
  const validateSchoolEmail = (email: string) =>
    /^[^\s@]+@st\.yc\.ac\.kr$/i.test(email);

  const generateCode = (len = 6) =>
    Math.floor(
      10 ** (len - 1) + Math.random() * 9 * 10 ** (len - 1)
    ).toString();

  const saveCodeToSession = (payload: StoredCode) =>
    sessionStorage.setItem("email_verify", JSON.stringify(payload));

  const loadCodeFromSession = (): StoredCode | null => {
    const raw = sessionStorage.getItem("email_verify");
    return raw ? (JSON.parse(raw) as StoredCode) : null;
  };

  const clearCodeFromSession = () => sessionStorage.removeItem("email_verify");

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    const saved = loadCodeFromSession();
    if (!saved) return;

    const remain = Math.max(
      0,
      Math.floor((saved.expiresAt - Date.now()) / 1000)
    );
    if (remain > 0) {
      setFormData((prev) => ({ ...prev, email: saved.email }));
      setIsCodeSent(true);
      setTimeLeft(remain);
    } else {
      clearCodeFromSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "학교 이메일을 입력해 주세요." }));
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
      return;
    }
    if (!validateSchoolEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "@st.yc.ac.kr 도메인만 사용할 수 있습니다.",
      }));
      return;
    }

    const stored = loadCodeFromSession();
    if (stored && stored.email === formData.email) {
      const since = Math.floor((Date.now() - stored.lastSentAt) / 1000);
      if (since < RESEND_COOLDOWN) {
        toast.error(`${RESEND_COOLDOWN - since}초 후에 다시 시도해 주세요.`);
        return;
      }
    }

    setIsSendingCode(true);
    try {
      const code = generateCode(6);
      const expiresAt = Date.now() + EXPIRE_SECONDS * 1000;

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: formData.email,
          verification_code: code,
        },
        EMAILJS_PUBLIC_KEY
      );

      saveCodeToSession({
        email: formData.email,
        code,
        expiresAt,
        lastSentAt: Date.now(),
      });

      setIsCodeSent(true);
      setTimeLeft(EXPIRE_SECONDS);
      toast.success("인증번호를 전송했습니다. 메일함을 확인해 주세요.");
    } catch (error) {
      console.error(error);
      toast.error("인증번호 전송에 실패했습니다.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = () => {
    if (!formData.verificationCode) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호를 입력해 주세요.",
      }));
      return;
    }

    const saved = loadCodeFromSession();
    if (!saved || saved.email !== formData.email) {
      toast.error("인증 요청 정보를 찾을 수 없습니다. 다시 시도해 주세요.");
      return;
    }
    if (Date.now() > saved.expiresAt) {
      toast.error("인증 시간이 만료되었습니다. 다시 요청해 주세요.");
      setTimeLeft(0);
      clearCodeFromSession();
      return;
    }

    if (saved.code === formData.verificationCode.trim()) {
      setIsVerified(true);
      setTimeLeft(0);
      clearCodeFromSession();
      toast.success("이메일 인증이 완료되었습니다.");
    } else {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호가 일치하지 않습니다.",
      }));
      toast.error("인증번호가 일치하지 않습니다.");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!isVerified) {
      toast.error("먼저 이메일 인증을 완료해 주세요.");
      return;
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "비밀번호는 최소 8자 이상 입력해 주세요.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    if (!formData.nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해 주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const user = {
      id: Date.now().toString(),
      email: formData.email,
      nickname: formData.nickname,
      role: "user",
    };

    toast.success("회원가입이 완료되었습니다.");
    login(user);
    navigate("/clubs");
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));

      if (field === "email" && !isVerified) {
        setIsCodeSent(false);
        setTimeLeft(0);
        clearCodeFromSession();
      }
    };

  const heroStyles: CSSProperties = {
    backgroundImage: "url('/assets/JoinUs_Background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute inset-0" style={heroStyles} />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-800/60" />
      <div className="relative z-10 flex w-full max-w-2xl items-center justify-center">
        <Card className="w-full max-w-2xl shadow-2xl">
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
              학교 이메일 인증을 마치고 동아리 탐색을 바로 시작해 보세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">학교 이메일</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="ex) 22260035@st.yc.ac.kr"
                    value={formData.email}
                    onChange={handleChange("email")}
                    disabled={isVerified}
                    className={isVerified ? "bg-gray-50" : ""}
                  />
                  {!isVerified && (
                    <Button
                      type="button"
                      onClick={handleSendVerificationCode}
                      disabled={isSendingCode || (isCodeSent && timeLeft > 0)}
                      variant="outline"
                      className="shrink-0"
                    >
                      {isSendingCode ? (
                        <Clock className="h-4 w-4 animate-spin" />
                      ) : isCodeSent && timeLeft > 0 ? (
                        `${formatTime(timeLeft)} 후 재전송`
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          인증번호 보내기
                        </>
                      )}
                    </Button>
                  )}
                  {isVerified && (
                    <Button
                      type="button"
                      disabled
                      variant="outline"
                      className="shrink-0 border-green-500 text-green-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
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
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="verificationCode">인증번호</Label>
                  <div className="flex gap-2">
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="6자리 숫자"
                      value={formData.verificationCode}
                      onChange={handleChange("verificationCode")}
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyCode}
                      variant="outline"
                      className="shrink-0"
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
                      <Clock className="h-3 w-3" />
                      남은 시간: {formatTime(timeLeft)}
                    </p>
                  ) : (
                    <p className="text-sm text-red-600">
                      인증 시간이 만료되었습니다. 다시 요청해 주세요.
                    </p>
                  )}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  value={formData.nickname}
                  onChange={handleChange("nickname")}
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
                  placeholder="8자 이상 입력해 주세요"
                  value={formData.password}
                  onChange={handleChange("password")}
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
                  placeholder="비밀번호를 다시 입력해 주세요"
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
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
                이미 계정이 있으신가요?{" "}
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

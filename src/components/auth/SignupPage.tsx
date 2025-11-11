import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
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
import { toast } from "sonner";
import { Mail, CheckCircle, Clock } from "lucide-react";
import emailjs from "@emailjs/browser";

interface SignupPageProps {
  setUser: (user: any) => void;
}

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

const EXPIRE_SECONDS = 180; // 3분
const RESEND_COOLDOWN = 60; // 60초 재발송 쿨다운 (원하면 timeLeft로 통합 가능)

type StoredCode = {
  email: string;
  code: string;
  expiresAt: number; // epoch ms
  lastSentAt: number; // epoch ms
};

export function SignupPage({ setUser }: SignupPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    verificationCode: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);

  // ===== 유틸 =====
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 8;
  const validateSchoolEmail = (email: string) =>
    /^[^\s@]+@st\.yc\.ac\.kr$/i.test(email);

  const generateCode = (len = 6) =>
    Math.floor(
      10 ** (len - 1) + Math.random() * 9 * 10 ** (len - 1)
    ).toString();

  const saveCodeToSession = (payload: StoredCode) => {
    sessionStorage.setItem("email_verify", JSON.stringify(payload));
  };

  const loadCodeFromSession = (): StoredCode | null => {
    const raw = sessionStorage.getItem("email_verify");
    return raw ? (JSON.parse(raw) as StoredCode) : null;
  };

  const clearCodeFromSession = () => sessionStorage.removeItem("email_verify");

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // 타이머
  useEffect(() => {
    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timeLeft]);

  // 새로고침 대비: 저장된 코드 남았으면 불러와서 남은 시간 복원
  useEffect(() => {
    const saved = loadCodeFromSession();
    if (saved) {
      const remain = Math.max(
        0,
        Math.floor((saved.expiresAt - Date.now()) / 1000)
      );
      if (remain > 0 && saved.email === formData.email) {
        setIsCodeSent(true);
        setTimeLeft(remain);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setErrors({ ...errors, email: "이메일을 입력해주세요." });
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: "올바른 이메일 형식이 아닙니다." });
      return;
    }
    if (!validateSchoolEmail(formData.email)) {
      setErrors({
        ...errors,
        email: "학교 이메일만 사용 가능합니다. (예: @st.yc.ac.kr)",
      });
      return;
    }

    // 쿨다운 체크
    const stored = loadCodeFromSession();
    if (stored && stored.email === formData.email) {
      const since = Math.floor((Date.now() - stored.lastSentAt) / 1000);
      if (since < RESEND_COOLDOWN) {
        toast.error(`잠시 후 재시도해주세요 (${RESEND_COOLDOWN - since}s)`);
        return;
      }
    }

    setIsSendingCode(true);
    try {
      const code = generateCode(6);
      const expiresAt = Date.now() + EXPIRE_SECONDS * 1000;

      // EmailJS로 전송
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: formData.email,
          code,
          expires_min: Math.floor(EXPIRE_SECONDS / 60).toString(),
        },
        EMAILJS_PUBLIC_KEY
      );

      // 세션 저장(테스트용·클라이언트 보관)
      saveCodeToSession({
        email: formData.email,
        code,
        expiresAt,
        lastSentAt: Date.now(),
      });

      setIsCodeSent(true);
      setTimeLeft(EXPIRE_SECONDS);
      toast.success("인증번호가 발송되었습니다. 이메일을 확인해주세요.");
    } catch (err: any) {
      console.error(err);
      toast.error("인증번호 발송에 실패했습니다.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = () => {
    if (!formData.verificationCode) {
      setErrors({ ...errors, verificationCode: "인증번호를 입력해주세요." });
      return;
    }

    const saved = loadCodeFromSession();
    if (!saved || saved.email !== formData.email) {
      toast.error("인증 정보가 없습니다. 재발송해주세요.");
      return;
    }
    if (Date.now() > saved.expiresAt) {
      toast.error("인증 시간이 만료되었습니다. 재발송해주세요.");
      setTimeLeft(0);
      return;
    }

    if (saved.code === formData.verificationCode.trim()) {
      setIsVerified(true);
      setTimeLeft(0);
      toast.success("이메일 인증이 완료되었습니다.");
      // 실사용이면 서버에 verified 표시 필요. 테스트용이라 세션만 정리
      clearCodeFromSession();
    } else {
      setErrors({
        ...errors,
        verificationCode: "인증번호가 일치하지 않습니다.",
      });
      toast.error("인증번호가 일치하지 않습니다.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!isVerified) {
      toast.error("이메일 인증을 완료해주세요.");
      return;
    }
    if (!validateEmail(formData.email))
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    if (!validatePassword(formData.password))
      newErrors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    if (!formData.nickname) newErrors.nickname = "닉네임을 입력해주세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Mock signup
    const user = {
      id: Date.now().toString(),
      email: formData.email,
      nickname: formData.nickname,
      role: "user",
    };
    toast.success("회원가입이 완료되었습니다.");
    setUser(user);
    navigate("/clubs");
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>
            ClubHub에 가입하여 동아리를 탐색해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 + 발송 버튼 */}
            <div className="space-y-2">
              <Label htmlFor="email">학교 이메일</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="22260035@st.yc.ac.kr"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
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
                      `재발송 (${formatTime(timeLeft)})`
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        인증번호 발송
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
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  인증이 완료되었습니다.
                </p>
              )}
            </div>

            {/* 인증 코드 입력 */}
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
                    placeholder="인증번호 6자리"
                    value={formData.verificationCode}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        verificationCode: e.target.value,
                      });
                      setErrors({ ...errors, verificationCode: "" });
                    }}
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    variant="outline"
                    className="shrink-0"
                    disabled={timeLeft === 0}
                  >
                    확인
                  </Button>
                </div>
                {errors.verificationCode && (
                  <p className="text-sm text-red-600">
                    {errors.verificationCode}
                  </p>
                )}
                {timeLeft > 0 ? (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    남은 시간: {formatTime(timeLeft)}
                  </p>
                ) : (
                  <p className="text-sm text-red-600">
                    인증 시간이 만료되었습니다. 인증번호를 재발송해주세요.
                  </p>
                )}
              </motion.div>
            )}

            {/* 닉네임/비번 */}
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="닉네임"
                value={formData.nickname}
                onChange={(e) => {
                  setFormData({ ...formData, nickname: e.target.value });
                  setErrors({ ...errors, nickname: "" });
                }}
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
                placeholder="8자 이상"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setErrors({ ...errors, password: "" });
                }}
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
                placeholder="비밀번호 재입력"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  setErrors({ ...errors, confirmPassword: "" });
                }}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
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
  );
}

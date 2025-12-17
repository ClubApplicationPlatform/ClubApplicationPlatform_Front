import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

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
import { registerLocalUser } from "../../lib/localAuth";
import {
  getSupportedEmailSuffixHint,
  matchCampusByEmail,
} from "../../lib/campuses";

const heroStyles = {
  backgroundImage: "url('/assets/JoinUs_Background.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
} as const;

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export function SignupPage() {
  const navigate = useNavigate();
  const emailHint = useMemo(() => getSupportedEmailSuffixHint(), []);

  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [modalInfo, setModalInfo] = useState<{
    title: string;
    message: string;
    isSuccess: boolean;
  } | null>(null);

  useEffect(() => {
    setIsEmailVerified(false);
    setIsCodeSent(false);
    setGeneratedCode("");
    setVerificationCode("");
  }, [form.email]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => password.length >= 8;

  useEffect(() => {
    if (!modalInfo?.isSuccess) {
      return;
    }
    const timer = setTimeout(() => {
      navigate("/login");
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate, modalInfo?.isSuccess]);

  const handleSendVerification = async (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!validateEmail(form.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일을 입력해주세요.",
      }));
      return;
    }
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error("이메일 인증 서비스 구성이 필요합니다.");
      return;
    }

    setIsSendingCode(true);
    const code = `${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: form.email,
          code,
          expires_min: "5",
        },
        EMAILJS_PUBLIC_KEY
      );
      setGeneratedCode(code);
      setIsCodeSent(true);
      setErrors((prev) => ({ ...prev, verification: "" }));
      toast.success("인증 코드를 이메일로 보냈습니다.");
    } catch (error) {
      console.error("이메일 인증 전송 실패", error);
      toast.error("인증 메일 송신에 실패했습니다.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = () => {
    if (!isCodeSent) {
      setErrors((prev) => ({
        ...prev,
        verification: "먼저 인증 코드를 받아주세요.",
      }));
      return;
    }
    setIsVerifyingCode(true);
    if (verificationCode.trim() === generatedCode) {
      setIsEmailVerified(true);
      setErrors((prev) => ({ ...prev, verification: "" }));
      toast.success("이메일 인증이 완료되었습니다.");
    } else {
      setErrors((prev) => ({
        ...prev,
        verification: "인증코드가 일치하지 않습니다.",
      }));
    }
    setIsVerifyingCode(false);
  };

  const submitRegistration = () => {
    const nextErrors: Record<string, string> = {};
    if (!validateEmail(form.email)) {
      nextErrors.email = "올바른 이메일 형식이 아닙니다.";
    }
    const campus = matchCampusByEmail(form.email);
    if (!campus) {
      toast.error(
        `사용 가능한 학교 이메일(${emailHint})인지 확인해주세요.`
      );
      return null;
    }
    if (!validatePassword(form.password)) {
      nextErrors.password = "비밀번호는 최소 8자 이상 입력해주세요.";
    }
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    if (!form.nickname.trim()) {
      nextErrors.nickname = "닉네임을 입력해주세요.";
    }
    if (!isEmailVerified) {
      nextErrors.verification = "이메일 인증을 완료해주세요.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return null;
    }

    setIsSubmitting(true);
    try {
      const user = registerLocalUser({
        email: form.email,
        password: form.password,
        nickname: form.nickname.trim(),
        campusId: campus.id,
      });
      toast.success(`${campus.name} 학생으로 가입되었어요.`);
      setModalInfo({
        title: "회원가입이 완료되었습니다",
        message: `${campus.name} 학생 인증이 확인되었어요.`,
        isSuccess: true,
      });
      return user;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다.";
      if (message === "이미 등록된 이메일입니다.") {
        setModalInfo({
          title: "이미 가입된 이메일입니다",
          message:
            "입력하신 이메일로는 이미 가입이 되어있습니다. 다른 메일을 사용하거나 로그인을 진행해주세요.",
          isSuccess: false,
        });
        return null;
      }
      toast.error(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitRegistration();
  };

  const handleSignupClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (modalInfo) {
      return;
    }
    submitRegistration();
  };

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  return (
    <>
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
              캠퍼스 이메일로 인증하고 계정을 만들어보세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">학교 이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="예) user@st.yc.ac.kr"
                  value={form.email}
                  onChange={handleChange("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="verificationCode"
                    type="text"
                    inputMode="numeric"
                    placeholder="인증코드 입력"
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    className="flex-1"
                    disabled={!isCodeSent}
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyCode}
                    disabled={!isCodeSent || isEmailVerified}
                    className="whitespace-nowrap"
                  >
                    {isVerifyingCode ? "확인 중..." : "코드 확인"}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendVerification}
                  disabled={isSendingCode || !form.email}
                  className="w-full"
                >
                  {isSendingCode
                    ? "인증메일 전송 중..."
                    : isCodeSent
                      ? "인증코드 재전송"
                      : "이메일 인증코드 받기"}
                </Button>
                {isEmailVerified && (
                  <p className="text-sm text-green-600">
                    이메일 인증이 완료되었습니다.
                  </p>
                )}
                {errors.verification && (
                  <p className="text-sm text-red-600">
                    {errors.verification}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  value={form.nickname}
                  onChange={handleChange("nickname")}
                  placeholder="닉네임을 입력해주세요"
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
                  placeholder="8자 이상 입력해주세요"
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
                  placeholder="비밀번호를 한 번 더 입력해주세요"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="button"
                className="w-full hover:cursor-pointer"
                onClick={handleSignupClick}
                disabled={isSubmitting || Boolean(modalInfo)}
              >
                {isSubmitting ? "가입 중..." : "회원가입"}
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
    {modalInfo && (
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
        <Card className="w-full max-w-sm animate-pop-in">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-xl">{modalInfo.title}</CardTitle>
            <CardDescription>{modalInfo.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {modalInfo.isSuccess && (
              <p className="text-sm text-gray-600">
                로그인 창으로 이동합니다. 버튼을 누르거나 잠시 기다려주세요.
              </p>
            )}
            <Button
              className="w-full hover:cursor-pointer"
              onClick={() => {
                if (modalInfo.isSuccess) {
                  navigate("/login");
                  return;
                }
                setModalInfo(null);
              }}
            >
              {modalInfo.isSuccess ? "로그인하러 가기" : "확인"}
            </Button>
            {modalInfo.isSuccess && (
              <p className="text-xs text-gray-500 text-center">
                4초 후 자동으로 로그인 화면으로 이동합니다.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )}
    </>
  );
}

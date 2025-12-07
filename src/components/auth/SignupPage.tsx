import { useMemo, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const REGISTER_ENDPOINT =
  "https://clubapplicationplatform-server.onrender.com/api/v1/auth/register";

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
    nickname: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => password.length >= 8;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!validateEmail(form.email)) {
      nextErrors.email = "올바른 이메일 형식이 아닙니다.";
    }
    const campus = matchCampusByEmail(form.email);
    if (!campus) {
      toast.error(`사용 가능한 학교 이메일(${emailHint})인지 확인해주세요.`);
      return;
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

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      email: form.email,
      password: form.password,
      username: form.nickname.trim(),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as {
        status?: number;
        data?: {
          id?: string | number;
          email?: string;
          username?: string;
          nickname?: string;
          role?: "admin" | "user";
          campusId?: string;
        } | null;
        message?: string;
      } | null;

      const isOk = response.ok && (body?.status ?? response.status) < 400;
      if (!isOk || body?.data === null) {
        const message =
          body?.message ??
          "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
        toast.error(message);
        return;
      }

      const registeredUser = body?.data ?? {};
      const user = {
        id: String(registeredUser.id ?? Date.now()),
        email: registeredUser.email ?? form.email,
        nickname:
          registeredUser.username ??
          registeredUser.nickname ??
          form.nickname.trim(),
        role: registeredUser.role === "admin" ? "admin" : ("user" as const),
        campusId: registeredUser.campusId ?? campus.id,
      };

      toast.success(body?.message ?? `${campus.name} 학생으로 가입되었어요.`);
      login(user);
      navigate("/clubs");
    } catch (error) {
      console.error(error);
      toast.error(
        "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
              학교 이메일을 입력하고 필요한 정보만 작성해 계정을 만들어 보세요.
              (이메일 인증은 현재 비활성화되어 바로 가입됩니다.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">학교 이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ex) user@st.yc.ac.kr 또는 user@gnu.ac.kr"
                  value={form.email}
                  onChange={handleChange("email")}
                />
                <p className="text-xs text-gray-500">
                  사용 가능한 이메일: {emailHint}
                </p>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
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
  );
}

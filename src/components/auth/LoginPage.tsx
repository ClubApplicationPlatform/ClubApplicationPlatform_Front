import { useState, type CSSProperties, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { matchCampusByEmail } from "../../lib/campuses";

const LOGIN_ENDPOINT =
  "https://clubapplicationplatform-server.onrender.com/api/v1/auth/login";

const heroStyles: CSSProperties = {
  backgroundImage: "url('/assets/JoinUs_Background.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const login = useAuthStore((state) => state.login);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const campus = matchCampusByEmail(formData.email);

    setIsSubmitting(true);
    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const body = (await response.json().catch(() => null)) as {
        status?: number;
        data?: {
          access_token?: string;
          refresh_token?: string;
        } | null;
        message?: string;
      } | null;

      const status = body?.status ?? response.status;
      const isOk = response.ok && status < 400;

      if (!isOk) {
        let message = body?.message;
        if (!message) {
          if (status === 400 || status === 401) {
            message = "이메일 또는 비밀번호를 확인해주세요.";
          } else if (status === 404) {
            message = "회원가입이 되어 있지 않거나 잘못된 정보입니다.";
          } else {
            message = "로그인에 실패했습니다. 다시 시도해주세요.";
          }
        }
        toast.error(message);
        return;
      }

      const accessToken = body?.data?.access_token;
      const refreshToken = body?.data?.refresh_token;
      if (!accessToken || !refreshToken) {
        toast.error("로그인에 필요한 토큰을 받지 못했습니다.");
        return;
      }

      const userId = formData.email.split("@")[0] || formData.email;
      const role: "admin" | "user" = userId.startsWith("admin")
        ? "admin"
        : "user";
      const user = {
        id: userId,
        email: formData.email,
        nickname: role === "admin" ? `관리자 ${userId}` : "JoinUs 회원",
        role,
        campusId: campus?.id ?? "",
      };

      login(user, { accessToken, refreshToken });
      const successMsg = body?.message
        ? body.message
        : campus?.name
          ? `${campus.name} 계정으로 로그인했어요.`
          : "로그인했어요.";
      toast.success(successMsg);
      navigate("/clubs");
    } catch (error) {
      console.error(error);
      toast.error("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0" style={heroStyles} />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-800/60" />

      <div className="relative z-10 flex w-full max-w-md items-center justify-center">
        <Card className="w-full shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center">
              <img
                src="/assets/JoinUs_Logo.png"
                alt="JoinUs"
                className="h-10 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-semibold">로그인</CardTitle>
            <CardDescription>
              캠퍼스 이메일로 로그인하고 맞춤 동아리 정보를 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">학교 이메일</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="이메일을 입력하세요 (@ 없이도 임시 허용)"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  임시로 @ 없이도 로그인 가능합니다.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="text-right">
                <Link
                  to="/password-reset"
                  className="text-sm text-blue-600 hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "로그인 중..." : "로그인"}
              </Button>

              <div className="text-center text-sm">
                아직 계정이 없나요?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  회원가입
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

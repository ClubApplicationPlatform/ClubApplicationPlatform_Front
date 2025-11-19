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
import {
  getSupportedEmailSuffixHint,
  matchCampusByEmail,
} from "../../lib/campuses";

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const login = useAuthStore((state) => state.login);
  const emailHint = getSupportedEmailSuffixHint();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const campus = matchCampusByEmail(formData.email);
    if (!campus) {
      toast.error(`허용된 학교 이메일(${emailHint})을 입력해 주세요.`);
      return;
    }

    const userId = formData.email.split("@")[0];
    const role: "admin" | "user" = userId.startsWith("admin")
      ? "admin"
      : "user";
    const user = {
      id: userId,
      email: formData.email,
      nickname: role === "admin" ? `관리자 ${userId}` : "JoinUs 회원",
      role,
      campusId: campus.id,
    };

    login(user);
    toast.success(`${campus.name} 계정으로 로그인했어요.`);
    navigate("/clubs");
  };

  const heroStyles: CSSProperties = {
    backgroundImage: "url('/assets/JoinUs_Background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
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
                  type="email"
                  placeholder="ex) user@st.yc.ac.kr 또는 user@gnu.ac.kr"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  사용 가능한 도메인: {emailHint}
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

              <Button type="submit" className="w-full">
                로그인
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

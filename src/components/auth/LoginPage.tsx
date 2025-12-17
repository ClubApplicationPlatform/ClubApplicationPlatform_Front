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
import { authenticateLocalUser } from "../../lib/localAuth";
import { matchCampusByEmail } from "../../lib/campuses";
import { mockClubs } from "../../lib/mockData";

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = authenticateLocalUser(formData.email, formData.password);
      login(user);
      const campus = matchCampusByEmail(user.email);
      const successMsg = campus
        ? `${campus.name} 소속으로 로그인했습니다.`
        : "로그인했습니다.";
      toast.success(successMsg);
      navigate("/clubs");
    } catch (error) {
      if (formData.password === "1234") {
        const normalizedInput = formData.email.toLowerCase();
        const clubIdCandidate = normalizedInput.replace(/@admin$/, "");
        const club = mockClubs.find((item) => item.id === clubIdCandidate);
        if (club) {
          const adminUser = {
            id: club.adminId || club.id,
            email: `${club.id}@admin`,
            nickname: `${club.name} 관리자`,
            role: "admin" as const,
            campusId: club.campusId,
          };
          login(adminUser);
          toast.success(
            `관리자 계정으로 ${club.name}에 로그인했습니다.`
          );
          navigate("/clubs");
          return;
        }
      }

      const message =
        error instanceof Error
          ? error.message
          : "로그인에 실패했습니다. 다시 시도해주세요.";
      toast.error(message);
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
              학교 이메일과 비밀번호로 안전하게 접속하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">학교 이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="예) user@st.yc.ac.kr"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
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
                아직 계정이 없으신가요?{" "}
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

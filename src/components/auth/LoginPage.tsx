import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { useAuthStore } from "../../stores/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock login - 이메일의 @ 앞부분을 id로 사용
    const userId = formData.email.split("@")[0];
    const user = {
      id: userId,
      email: formData.email,
      nickname: userId.startsWith("admin") ? `관리자 ${userId}` : "홍길동",
      role: userId.startsWith("admin") ? "admin" : "user",
    };

    login(user);
    toast.success("로그인되었습니다.");
    navigate("/clubs");
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>JoinUs 계정으로 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@st.yc.ac.kr"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호"
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
              계정이 없으신가요?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                회원가입
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

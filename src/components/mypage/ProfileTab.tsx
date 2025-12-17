import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import type { AuthUser } from "../../stores/authStore";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

type EditableFields = Partial<{
  phone: string;
  department: string;
  studentId: string;
}>;

interface ProfileTabProps {
  user: AuthUser & EditableFields;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [formData, setFormData] = useState({
    nickname: user.nickname ?? "",
    phone: user.phone ?? "",
    department: user.department ?? "",
    studentId: user.studentId ?? "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("정보가 수정되었습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 정보</CardTitle>
        <CardDescription>회원 정보를 수정할 수 있습니다</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500">이메일은 변경할 수 없습니다</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              type="text"
              value={formData.nickname}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  nickname: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentId">학번</Label>
            <Input
              id="studentId"
              type="text"
              placeholder="22260035"
              value={formData.studentId}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  studentId: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">학과</Label>
            <Input
              id="department"
              type="text"
              placeholder="스마트소프트웨어학과"
              value={formData.department}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  department: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">연락처</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="010-4669-2902"
              value={formData.phone}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, phone: event.target.value }))
              }
            />
          </div>

          <Button type="submit" className="w-full hover:cursor-pointer">
            저장하기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { type ReactNode, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { mockApplications } from "../../lib/mockData";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

export function ApplicantDetailPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState("");

  const application = useMemo(
    () => mockApplications.find((item) => item.id === applicationId),
    [applicationId]
  );

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p>지원서를 찾을 수 없습니다.</p>
            <Button className="mt-4" onClick={() => navigate("/clubs")}>
              모집 목록으로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const goBack = () => navigate(`/clubs/${application.clubId}/manage`);

  const handleAccept = () => {
    if (!resultMessage.trim()) {
      toast.error("합격 메시지를 입력해주세요.");
      return;
    }
    toast.success("합격 처리되었습니다.");
    goBack();
  };

  const handleReject = () => {
    toast.success("불합격 처리되었습니다.");
    goBack();
  };

  const renderStatusBadge = () => {
    if (application.status === "accepted") {
      return <Badge className="bg-green-600">합격</Badge>;
    }
    if (application.status === "rejected") {
      return <Badge className="bg-gray-400">불합격</Badge>;
    }
    if (application.status === "document_passed") {
      return <Badge className="bg-blue-600">서류 합격</Badge>;
    }
    return <Badge variant="outline">검토 중</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={goBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            신청자 목록으로
          </Button>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">지원서 상세</h1>
              <p className="text-gray-600">{application.clubName}</p>
            </div>
            <div className="flex flex-col items-end gap-2 text-sm sm:flex-row sm:items-center">
              <Badge variant="outline">지원일: {application.appliedAt}</Badge>
              {renderStatusBadge()}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>지원자 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <InfoItem icon={<User className="h-5 w-5 text-gray-400" />} label="이름">
                {application.applicantName}
              </InfoItem>
              <InfoItem icon={<BookOpen className="h-5 w-5 text-gray-400" />} label="학번">
                {application.studentId}
              </InfoItem>
              <InfoItem icon={<Mail className="h-5 w-5 text-gray-400" />} label="학과">
                {application.department}
              </InfoItem>
              <InfoItem icon={<Phone className="h-5 w-5 text-gray-400" />} label="연락처">
                {application.phone}
              </InfoItem>
            </CardContent>
          </Card>

          {application.answers.map((answer, index) => (
            <Card key={`${answer.question}-${index}`}>
              <CardHeader className="bg-gray-50">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">Q{index + 1}</Badge>
                  <CardTitle className="text-lg">{answer.question}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="whitespace-pre-wrap text-gray-700">{answer.answer}</p>
                <div className="mt-2 text-sm text-gray-500">{answer.answer.length}자</div>
              </CardContent>
            </Card>
          ))}

          {application.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>합격/불합격 처리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="result-message">
                    메시지 <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id="result-message"
                    value={resultMessage}
                    onChange={(event) => setResultMessage(event.target.value)}
                    placeholder={`합격 시: 축하 메시지와 카카오톡 오픈채팅 링크를 입력해주세요\n불합격 시: 지원에 대한 감사 메시지를 입력해주세요`}
                    className="min-h-[120px]"
                  />
                  <p className="text-sm text-gray-500">
                    합격 메시지 예시: 합격을 축하드립니다! 카카오톡 오픈채팅방 링크:
                    https://open.kakao.com/example
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={handleAccept} className="flex-1 bg-green-600 hover:bg-green-700">
                    합격 처리
                  </Button>
                  <Button onClick={handleReject} variant="outline" className="flex-1">
                    불합격 처리
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {application.result && (
            <Card>
              <CardHeader>
                <CardTitle>처리 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">상태:</span>
                  {renderStatusBadge()}
                </div>
                <div>
                  <span className="text-sm text-gray-500">메시지:</span>
                  <p className="mt-1 text-gray-700">{application.result.message}</p>
                </div>
                <div className="text-sm text-gray-500">처리일: {application.result.decidedAt}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{children}</p>
      </div>
    </div>
  );
}

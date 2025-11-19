import { useEffect, useMemo, useState } from "react";
import type { Club as AdminClub } from "../../lib/mockData";
import { mockClubs } from "../../lib/mockData";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  ClipboardList,
  PlusCircle,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useActiveCampus } from "../../hooks/useActiveCampus";

type ClubTypeOption = "major" | "general";

interface NewClubFormState {
  name: string;
  adminId: string;
  category: string;
  department: string;
  type: ClubTypeOption;
  shortDescription: string;
  description: string;
  members: string;
  recruitDeadline: string;
  imageUrl: string;
  tags: string;
}

interface ActivityLogItem {
  id: string;
  message: string;
  timestamp: string;
}

const CLUB_STORAGE_KEY = "admin-dashboard:clubs";
const LOG_STORAGE_KEY = "admin-dashboard:activity-log";

const defaultFormState: NewClubFormState = {
  name: "",
  adminId: "",
  category: "",
  department: "",
  type: "major",
  shortDescription: "",
  description: "",
  members: "0",
  recruitDeadline: "",
  imageUrl: "",
  tags: "",
};

const cloneClub = (club: AdminClub): AdminClub => ({
  ...club,
  activities: [...club.activities],
  tags: [...club.tags],
  notices: club.notices.map((notice) => ({ ...notice })),
});

const hydrationFallback = mockClubs.map(cloneClub);

const usePersistentState = <T,>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue) as T;
      }
    } catch {
      // ignore broken data and use initial value
    }
    return initialValue;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  const updater = (value: T | ((prev: T) => T)) => {
    setState((prev) => (typeof value === "function" ? (value as (p: T) => T)(prev) : value));
  };

  return [state, updater];
};

export function AdminDashboardPage() {
  const [clubs, setClubs] = usePersistentState<AdminClub[]>(
    CLUB_STORAGE_KEY,
    hydrationFallback
  );
  const [activityLog, setActivityLog] = usePersistentState<ActivityLogItem[]>(
    LOG_STORAGE_KEY,
    []
  );
  const [newClubForm, setNewClubForm] =
    useState<NewClubFormState>(defaultFormState);
  const [pendingAdminIds, setPendingAdminIds] = useState<Record<string, string>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | ClubTypeOption>("all");
  const [formMessage, setFormMessage] = useState<{
    variant: "success" | "error";
    text: string;
  } | null>(null);
  const user = useAuthStore((state) => state.user);
  const campus = useActiveCampus();
  const campusId = campus?.id ?? user?.campusId ?? "yonam";

  const clubStats = useMemo(() => {
    const recruiting = clubs.filter((club) => club.isRecruiting).length;
    const general = clubs.filter((club) => club.type === "general").length;
    const major = clubs.filter((club) => club.type === "major").length;
    const missingAdmin = clubs.filter(
      (club) => club.adminId.trim().length === 0
    ).length;

    return {
      total: clubs.length,
      recruiting,
      general,
      major,
      missingAdmin,
    };
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return clubs
      .filter((club) => (club.campusId ?? "yonam") === campusId)
      .filter((club) => {
        const matchesTerm =
          normalizedTerm.length === 0 ||
          club.name.toLowerCase().includes(normalizedTerm) ||
          club.adminId.toLowerCase().includes(normalizedTerm);

        const matchesType =
          typeFilter === "all" ? true : club.type === typeFilter;

        return matchesTerm && matchesType;
      });
  }, [campusId, clubs, searchTerm, typeFilter]);

  const sortedClubs = useMemo(() => {
    return [...filteredClubs].sort((a, b) =>
      a.name.localeCompare(b.name, "ko-KR")
    );
  }, [filteredClubs]);

  const handleFormChange = (
    field: keyof NewClubFormState,
    value: string
  ) => {
    setFormMessage(null);
    setNewClubForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setNewClubForm(defaultFormState);
    setFormMessage(null);
  };

  const logAction = (message: string) => {
    const nextLog: ActivityLogItem = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      message,
      timestamp: new Date().toLocaleString(),
    };

    setActivityLog((prev) => [nextLog, ...prev].slice(0, 8));
  };

  const handleCreateClub = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newClubForm.name.trim() || !newClubForm.adminId.trim()) {
      setFormMessage({
        variant: "error",
        text: "동아리명과 관리자 ID를 입력해주세요.",
      });
      return;
    }

    const normalizedMembers = Number(newClubForm.members);
    const members = Number.isFinite(normalizedMembers)
      ? Math.max(0, normalizedMembers)
      : 0;

    const slug = newClubForm.name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 20);
    const uniqueId = `${slug || "club"}-${Date.now()
      .toString(36)
      .slice(-4)}`;

    const newClub: AdminClub = {
      id: uniqueId,
      name: newClubForm.name.trim(),
      adminId: newClubForm.adminId.trim(),
      campusId,
      category: newClubForm.category.trim() || "미지정",
      department: newClubForm.department.trim() || "공통",
      type: newClubForm.type,
      shortDescription:
        newClubForm.shortDescription.trim() || "신규 등록된 동아리입니다.",
      description:
        newClubForm.description.trim() ||
        newClubForm.shortDescription ||
        "세부 설명이 등록되지 않았습니다.",
      members,
      recruitDeadline:
        newClubForm.recruitDeadline || new Date().toISOString().slice(0, 10),
      imageUrl:
        newClubForm.imageUrl.trim() || "../../public/assets/JoinUs_Logo.png",
      tags: newClubForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      direction: "",
      activities: [],
      notices: [],
      isRecruiting: true,
    };

    setClubs((prev) => [newClub, ...prev]);
    setFormMessage({
      variant: "success",
      text: `"${newClub.name}" 동아리가 등록되었습니다.`,
    });
    logAction(`${newClub.name} 동아리를 신규 등록했습니다.`);
    resetForm();
  };

  const handleAdminInputChange = (clubId: string, value: string) => {
    setPendingAdminIds((prev) => ({
      ...prev,
      [clubId]: value,
    }));
  };

  const handleSaveAdmin = (clubId: string) => {
    const target = clubs.find((club) => club.id === clubId);
    if (!target) return;

    const nextAdmin = (pendingAdminIds[clubId] ?? target.adminId).trim();
    if (!nextAdmin) {
      return;
    }

    setClubs((prev) =>
      prev.map((club) =>
        club.id === clubId ? { ...club, adminId: nextAdmin } : club
      )
    );

    setPendingAdminIds((prev) => {
      const next = { ...prev };
      delete next[clubId];
      return next;
    });

    logAction(`${target.name} 관리자 ID를 ${nextAdmin}로 변경했습니다.`);
  };

  const handleToggleRecruiting = (clubId: string) => {
    setClubs((prev) =>
      prev.map((club) =>
        club.id === clubId
          ? { ...club, isRecruiting: !club.isRecruiting }
          : club
      )
    );

    const updated = clubs.find((club) => club.id === clubId);
    if (updated) {
      logAction(
        `${updated.name} 모집 상태를 ${
          updated.isRecruiting ? "모집 마감" : "모집 중"
        }으로 변경했습니다.`
      );
    }
  };

  const handleDeleteClub = (clubId: string) => {
    const target = clubs.find((club) => club.id === clubId);
    if (!target) {
      return;
    }

    const confirmed =
      typeof window === "undefined"
        ? true
        : window.confirm(
            `"${target.name}" 동아리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
          );

    if (!confirmed) {
      return;
    }

    setClubs((prev) => prev.filter((club) => club.id !== clubId));
    logAction(`${target.name} 동아리를 삭제했습니다.`);
  };

  const handleResetDataset = () => {
    setClubs(hydrationFallback.map(cloneClub));
    logAction("모든 동아리 정보를 기본값으로 되돌렸습니다.");
  };

  const handleClearLog = () => {
    setActivityLog([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            관리자 전용
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            동아리 관리 대시보드
          </h1>
          <p className="text-slate-600">
            동아리 생성, 관리자 배정, 모집 상태 제어를 한 화면에서 빠르게
            처리하세요.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-blue-100 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                등록된 동아리
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">
                {clubStats.total}
              </p>
              <p className="text-xs text-slate-500">
                전일 대비 {clubStats.total >= hydrationFallback.length ? "+" : "-"}
                {Math.abs(clubStats.total - hydrationFallback.length)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                모집 중
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">
                {clubStats.recruiting}
              </p>
              <p className="text-xs text-slate-500">
                전체의{" "}
                {clubStats.total
                  ? Math.round((clubStats.recruiting / clubStats.total) * 100)
                  : 0}
                %
              </p>
            </CardContent>
          </Card>
          <Card className="border-purple-100 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                전공/일반
              </CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-slate-900">
                {clubStats.major} 전공 · {clubStats.general} 일반
              </p>
              <p className="text-xs text-slate-500">
                전공 비중{" "}
                {clubStats.total
                  ? Math.round((clubStats.major / clubStats.total) * 100)
                  : 0}
                %
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-100 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                관리자 미지정
              </CardTitle>
              <Shield className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">
                {clubStats.missingAdmin}
              </p>
              <p className="text-xs text-slate-500">
                빠르게 관리자 ID를 지정하세요.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b pb-6">
              <div>
                <CardTitle className="text-xl">신규 동아리 등록</CardTitle>
                <CardDescription>
                  필수 정보만 입력하면 즉시 리스트에 반영됩니다.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-5" onSubmit={handleCreateClub}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700">
                    동아리명 *
                    <Input
                      value={newClubForm.name}
                      onChange={(event) =>
                        handleFormChange("name", event.target.value)
                      }
                      placeholder="예: 스마트그리드 연구회"
                      className="mt-1"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    관리자 ID *
                    <Input
                      value={newClubForm.adminId}
                      onChange={(event) =>
                        handleFormChange("adminId", event.target.value)
                      }
                      placeholder="예: sg_admin"
                      className="mt-1"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700">
                    분류
                    <Input
                      value={newClubForm.category}
                      onChange={(event) =>
                        handleFormChange("category", event.target.value)
                      }
                      placeholder="예: 에너지/전력"
                      className="mt-1"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    소속 학과
                    <Input
                      value={newClubForm.department}
                      onChange={(event) =>
                        handleFormChange("department", event.target.value)
                      }
                      placeholder="예: 전자공학부"
                      className="mt-1"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="text-sm font-medium text-slate-700">
                    동아리 유형
                    <select
                      value={newClubForm.type}
                      onChange={(event) =>
                        handleFormChange("type", event.target.value)
                      }
                      className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <option value="major">전공 동아리</option>
                      <option value="general">일반 동아리</option>
                    </select>
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    현재 인원
                    <Input
                      type="number"
                      min={0}
                      value={newClubForm.members}
                      onChange={(event) =>
                        handleFormChange("members", event.target.value)
                      }
                      className="mt-1"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    모집 마감일
                    <Input
                      type="date"
                      value={newClubForm.recruitDeadline}
                      onChange={(event) =>
                        handleFormChange("recruitDeadline", event.target.value)
                      }
                      className="mt-1"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700">
                    대표 이미지 경로
                    <Input
                      value={newClubForm.imageUrl}
                      onChange={(event) =>
                        handleFormChange("imageUrl", event.target.value)
                      }
                      placeholder="../../public/assets/sample.png"
                      className="mt-1"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    태그 (콤마 구분)
                    <Input
                      value={newClubForm.tags}
                      onChange={(event) =>
                        handleFormChange("tags", event.target.value)
                      }
                      placeholder="AI, 프로젝트, 신입환영"
                      className="mt-1"
                    />
                  </label>
                </div>

                <label className="text-sm font-medium text-slate-700">
                  요약 설명
                  <Textarea
                    value={newClubForm.shortDescription}
                    onChange={(event) =>
                      handleFormChange("shortDescription", event.target.value)
                    }
                    placeholder="한 줄 요약 혹은 홍보 문구를 입력하세요."
                    className="mt-1"
                    rows={2}
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  상세 설명
                  <Textarea
                    value={newClubForm.description}
                    onChange={(event) =>
                      handleFormChange("description", event.target.value)
                    }
                    placeholder="주요 활동, 방향성을 구체적으로 적어주세요."
                    className="mt-1"
                    rows={4}
                  />
                </label>

                {formMessage && (
                  <p
                    className={`text-sm ${
                      formMessage.variant === "error"
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {formMessage.text}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    className="flex items-center gap-2 hover:cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    동아리 등록
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="hover:cursor-pointer"
                  >
                    양식 초기화
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b pb-6">
              <div>
                <CardTitle className="text-lg">관리 로그</CardTitle>
                <CardDescription>
                  최근 작업 8개까지 자동으로 기록됩니다.
                </CardDescription>
              </div>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearLog}
                  className="text-slate-500 hover:text-slate-900"
                >
                  로그 비우기
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-2 border-amber-200 text-amber-600 hover:cursor-pointer hover:border-amber-300"
                onClick={handleResetDataset}
              >
                <RefreshCw className="h-4 w-4" />
                기본 데이터로 되돌리기
              </Button>
              <div className="space-y-3">
                {activityLog.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    아직 기록된 작업이 없습니다.
                  </p>
                ) : (
                  activityLog.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/80 p-3"
                    >
                      <p className="text-sm font-medium text-slate-800">
                        {log.message}
                      </p>
                      <p className="text-xs text-slate-500">{log.timestamp}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="gap-4 border-b pb-6">
            <div>
              <CardTitle className="text-xl">동아리 운영 현황</CardTitle>
              <CardDescription>
                관리자 정보, 모집 상태, 불필요한 동아리 삭제까지 한 번에 관리할
                수 있습니다.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="동아리명 혹은 관리자 ID 검색"
                  className="h-11 w-full pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["all", "major", "general"] as const).map((option) => (
                  <Button
                    key={option}
                    size="sm"
                    variant={typeFilter === option ? "default" : "outline"}
                    onClick={() => setTypeFilter(option)}
                    className="hover:cursor-pointer"
                  >
                    {option === "all"
                      ? "전체"
                      : option === "major"
                      ? "전공"
                      : "일반"}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {sortedClubs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                조건에 맞는 동아리가 없습니다. 필터를 조정하거나 새로운
                동아리를 등록해보세요.
              </div>
            ) : (
              sortedClubs.map((club) => {
                const pendingAdmin =
                  pendingAdminIds[club.id] ?? club.adminId ?? "";
                const isDirty = pendingAdmin.trim() !== club.adminId.trim();

                return (
                  <div
                    key={club.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {club.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {club.department} · {club.category}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={club.type === "major" ? "default" : "secondary"}
                          className="uppercase tracking-wide"
                        >
                          {club.type === "major" ? "전공" : "일반"}
                        </Badge>
                        <Badge
                          variant={club.isRecruiting ? "default" : "outline"}
                          className={
                            club.isRecruiting
                              ? "bg-emerald-100 text-emerald-700"
                              : "text-slate-600"
                          }
                        >
                          {club.isRecruiting ? "모집 중" : "모집 마감"}
                        </Badge>
                        {!club.adminId && (
                          <Badge variant="destructive">관리자 미지정</Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-center">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                          관리자 ID
                        </p>
                        <Input
                          value={pendingAdmin}
                          onChange={(event) =>
                            handleAdminInputChange(club.id, event.target.value)
                          }
                          placeholder="관리자 계정을 입력하세요"
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                          최근 활동 요약
                        </p>
                        <p className="line-clamp-2 text-sm text-slate-600">
                          {club.shortDescription}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="w-full gap-2 hover:cursor-pointer md:w-auto"
                          onClick={() => handleToggleRecruiting(club.id)}
                        >
                          <ShieldCheck className="h-4 w-4" />
                          {club.isRecruiting ? "모집 마감 처리" : "모집 재개"}
                        </Button>
                        <div className="flex w-full gap-2 md:justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="default"
                            disabled={!isDirty}
                            onClick={() => handleSaveAdmin(club.id)}
                            className="flex-1 gap-2 hover:cursor-pointer md:flex-none"
                          >
                            <Shield className="h-4 w-4" />
                            관리자 저장
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClub(club.id)}
                            className="flex-1 gap-2 hover:cursor-pointer md:flex-none"
                          >
                            <Trash2 className="h-4 w-4" />
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

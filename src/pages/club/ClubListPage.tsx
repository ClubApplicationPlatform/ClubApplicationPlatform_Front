import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Globe } from "lucide-react";

import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import ClubGrid from "../../components/club/ClubGrid";
import { useClubSearchStore } from "../../stores/clubSearchStore";
import { getClubsForCampus, type Club } from "../../lib/mockData";
import { useActiveCampus } from "../../hooks/useActiveCampus";
import { useAuthStore } from "../../stores/authStore";

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border bg-white p-8 text-gray-600 shadow-sm">
    <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    <p className="text-base">동아리 정보를 불러오는 중입니다...</p>
  </div>
);

export function ClubListPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const campus = useActiveCampus();
  const campusId = campus?.id ?? user?.campusId ?? null;

  const searchQuery = useClubSearchStore((state) => state.query);
  const trimmedQuery = searchQuery.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();

  const [selectedDepartment, setSelectedDepartment] = useState<string>("전체");
  const [selectedType, setSelectedType] = useState<"all" | "major" | "general">(
    "all"
  );
  const [recruitStatus, setRecruitStatus] = useState<
    "all" | "recruiting" | "closed"
  >("all");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const departments = [
    "전체",
    "스마트전기전자공학과",
    "스마트전기전자공학과",
    "기계공학과",
    "스마트기계공학과",
    "스마트소프트웨어과",
  ];

  useEffect(() => {
    if (!campusId) {
      setClubs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setClubs(getClubsForCampus(campusId));
    setIsLoading(false);
  }, [campusId]);


  const campusClubs = useMemo(() => clubs, [clubs]);

  const filteredClubs = useMemo(() => {
    return campusClubs.filter((club) => {
      const matchesSearch =
        trimmedQuery.length === 0 ||
        club.name.toLowerCase().includes(normalizedQuery) ||
        club.shortDescription.toLowerCase().includes(normalizedQuery);

      const matchesType = selectedType === "all" || club.type === selectedType;
      const matchesDepartment =
        selectedType !== "major" ||
        selectedDepartment === "전체" ||
        club.department === selectedDepartment;
      const matchesRecruit =
        recruitStatus === "all" ||
        (recruitStatus === "recruiting" && club.isRecruiting) ||
        (recruitStatus === "closed" && !club.isRecruiting);

      return (
        matchesSearch && matchesType && matchesDepartment && matchesRecruit
      );
    });
  }, [
    campusClubs,
    normalizedQuery,
    recruitStatus,
    selectedDepartment,
    selectedType,
    trimmedQuery,
  ]);

  const majorClubs = filteredClubs.filter((club) => club.type === "major");
  const generalClubs = filteredClubs.filter((club) => club.type === "general");

  if (!user || !campus || !campusId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-10 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-semibold">
            캠퍼스 정보를 불러올 수 없어요
          </h1>
          <p className="mb-6 text-gray-600">
            다시 로그인하면 학교별 동아리 정보를 확인할 수 있어요.
          </p>
          <Button onClick={() => navigate("/login")}>로그인 페이지 이동</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-4">{campus.heroTitle}</h1>
          <p className="mb-8 text-blue-50">{campus.heroDescription}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {trimmedQuery && (
          <div className="mb-8 rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">
                "{trimmedQuery}"
              </span>
              검색 결과입니다.
            </p>
          </div>
        )}

        <Tabs
          value={selectedType}
          onValueChange={(value) => {
            setSelectedType(value as typeof selectedType);
            setSelectedDepartment("전체");
          }}
          className="mb-8"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all" className="gap-2 hover:cursor-pointer">
              <Globe className="h-4 w-4" />
              전체
            </TabsTrigger>
            <TabsTrigger value="major" className="gap-2 hover:cursor-pointer">
              <GraduationCap className="h-4 w-4" />
              전공 동아리
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2 hover:cursor-pointer">
              <Users className="h-4 w-4" />
              일반 동아리
            </TabsTrigger>
          </TabsList>

          {selectedType === "major" ? (
            <div className="mt-6 mb-8 flex items-center justify-between gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {departments.map((department) => (
                  <Button
                    key={department}
                    variant={
                      selectedDepartment === department ? "default" : "outline"
                    }
                    onClick={() => setSelectedDepartment(department)}
                    className="whitespace-nowrap hover:cursor-pointer"
                  >
                    {department}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2 shrink-0">
                <Button
                  variant={recruitStatus === "all" ? "default" : "outline"}
                  onClick={() => setRecruitStatus("all")}
                  className="whitespace-nowrap hover:cursor-pointer"
                  size="sm"
                >
                  전체
                </Button>
                <Button
                  variant={
                    recruitStatus === "recruiting" ? "default" : "outline"
                  }
                  onClick={() => setRecruitStatus("recruiting")}
                  className="whitespace-nowrap hover:cursor-pointer"
                  size="sm"
                >
                  모집중
                </Button>
                <Button
                  variant={recruitStatus === "closed" ? "default" : "outline"}
                  onClick={() => setRecruitStatus("closed")}
                  className="whitespace-nowrap hover:cursor-pointer"
                  size="sm"
                >
                  모집마감
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 mb-8 flex justify-end gap-2">
              <Button
                variant={recruitStatus === "all" ? "default" : "outline"}
                onClick={() => setRecruitStatus("all")}
                className="whitespace-nowrap hover:cursor-pointer"
                size="sm"
              >
                전체
              </Button>
              <Button
                variant={recruitStatus === "recruiting" ? "default" : "outline"}
                onClick={() => setRecruitStatus("recruiting")}
                className="whitespace-nowrap hover:cursor-pointer"
                size="sm"
              >
                모집중
              </Button>
              <Button
                variant={recruitStatus === "closed" ? "default" : "outline"}
                onClick={() => setRecruitStatus("closed")}
                className="whitespace-nowrap hover:cursor-pointer"
                size="sm"
              >
                모집마감
              </Button>
            </div>
          )}

          <TabsContent value="all">
            {isLoading ? (
              <LoadingState />
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    총{" "}
                    <span className="text-blue-600">
                      {filteredClubs.length}
                    </span>
                    개의 동아리가 검색되었습니다.
                  </p>
                </div>
                <ClubGrid
                  searchQuery={searchQuery}
                  selectedType={selectedType}
                  selectedDepartment={selectedDepartment}
                  recruitStatus={recruitStatus}
                  clubs={filteredClubs}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="major">
            {isLoading ? (
              <LoadingState />
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    전공 동아리{" "}
                    <span className="text-blue-600">{majorClubs.length}</span>개
                  </p>
                </div>
                <ClubGrid
                  searchQuery={searchQuery}
                  selectedType={selectedType}
                  selectedDepartment={selectedDepartment}
                  recruitStatus={recruitStatus}
                  clubs={majorClubs}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="general">
            {isLoading ? (
              <LoadingState />
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    일반 동아리{" "}
                    <span className="text-blue-600">{generalClubs.length}</span>
                    개
                  </p>
                </div>
                <ClubGrid
                  searchQuery={searchQuery}
                  selectedType={selectedType}
                  selectedDepartment={selectedDepartment}
                  recruitStatus={recruitStatus}
                  clubs={generalClubs}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Users, GraduationCap, Globe } from "lucide-react";
import { mockClubs } from "../../lib/mockData";
import ClubGrid from "../../components/club/ClubGrid";
import { useClubSearchStore } from "../../stores/clubSearchStore";

export function ClubListPage() {
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

  // 학과 목록
  const departments = [
    "전체",
    "전기전자공학과",
    "스마트전기전자공학과",
    "기계공학과",
    "스마트기계공학과",
    "스마트소프트웨어학과",
  ];

  const filteredClubs = mockClubs.filter((club) => {
    const matchesSearch =
      trimmedQuery === "" ||
      club.name.toLowerCase().includes(normalizedQuery) ||
      club.shortDescription.toLowerCase().includes(normalizedQuery);
    const matchesType = selectedType === "all" || club.type === selectedType;

    // 전공 동아리일 때만 학과 필터 적용
    const matchesDepartment =
      selectedType !== "major" ||
      selectedDepartment === "전체" ||
      club.department === selectedDepartment;

    // 모집 상태 필터
    const matchesRecruit =
      recruitStatus === "all" ||
      (recruitStatus === "recruiting" && club.isRecruiting) ||
      (recruitStatus === "closed" && !club.isRecruiting);

    return matchesSearch && matchesType && matchesDepartment && matchesRecruit;
  });

  const majorClubs = filteredClubs.filter((club) => club.type === "major");
  const generalClubs = filteredClubs.filter((club) => club.type === "general");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-4">우리 학교의 모든 동아리</h1>
          <p className="mb-8 text-blue-50">
            관심있는 동아리를 찾아 지원해보세요
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {trimmedQuery && (
          <div className="mb-8 rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">
                "{trimmedQuery}"
              </span>
              {"에 대한 결과입니다."}
            </p>
          </div>
        )}
        <Tabs
          value={selectedType}
          onValueChange={(v) => {
            setSelectedType(v as any);
            setSelectedDepartment("전체"); // 탭 변경시 필터 초기화
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

          {selectedType === "major" && (
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
          )}

          {selectedType !== "major" && (
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
            <div className="mb-6">
              <p className="text-gray-600">
                총 <span className="text-blue-600">{filteredClubs.length}</span>
                개의 동아리
              </p>
            </div>
            <ClubGrid
              searchQuery={searchQuery}
              selectedType={selectedType}
              selectedDepartment={selectedDepartment}
              recruitStatus={recruitStatus}
              clubs={filteredClubs}
            />
          </TabsContent>

          <TabsContent value="major">
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
          </TabsContent>

          <TabsContent value="general">
            <div className="mb-6">
              <p className="text-gray-600">
                일반 동아리{" "}
                <span className="text-blue-600">{generalClubs.length}</span>개
              </p>
            </div>
            <ClubGrid
              searchQuery={searchQuery}
              selectedType={selectedType}
              selectedDepartment={selectedDepartment}
              recruitStatus={recruitStatus}
              clubs={generalClubs}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

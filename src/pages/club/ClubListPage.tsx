import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Search, Users, Calendar, GraduationCap, Globe } from "lucide-react";
import { mockClubs } from "../../lib/mockData";

interface ClubListPageProps {
  user: any;
}

export function ClubListPage({ user }: ClubListPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
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
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
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

  const renderClubGrid = (clubs: typeof mockClubs) => (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={`${selectedType}-${selectedDepartment}-${recruitStatus}-${searchQuery}`}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {clubs.map((club) => (
          <motion.div
            key={club.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Card
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg h-full"
              onClick={() => navigate(`/clubs/${club.id}`)}
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                  src={club.imageUrl}
                  alt={club.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/fallback.png";
                  }}
                  loading="lazy"
                />
                {club.isRecruiting && (
                  <Badge className="absolute right-3 top-3 bg-green-600">
                    모집중
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="absolute left-3 top-3 bg-white/90"
                >
                  {club.type === "major" ? club.department : "일반"}
                </Badge>
              </div>

              <CardContent className="p-5">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="line-clamp-1">{club.name}</h3>
                  {club.type === "general" && (
                    <Badge variant="outline" className="ml-2 shrink-0">
                      {club.category}
                    </Badge>
                  )}
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {club.shortDescription}
                </p>

                <div className="mb-3 flex flex-wrap gap-1">
                  {club.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t pt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{club.members}명</span>
                  </div>
                  {club.isRecruiting && club.recruitDeadline && (
                    <div className="flex items-center gap-1 text-red-600">
                      <Calendar className="h-4 w-4" />
                      <span>{club.recruitDeadline}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {clubs.length === 0 && (
          <motion.div
            className="col-span-full py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="mb-4">우리 학교의 모든 동아리</h1>
          <p className="mb-8 text-blue-50">
            관심있는 동아리를 찾아 지원해보세요
          </p>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-200" />
            <Input
              placeholder="동아리 이름이나 키워드로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-gray-900 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={selectedType}
          onValueChange={(v) => {
            setSelectedType(v as any);
            setSelectedDepartment("전체"); // 탭 변경시 필터 초기화
          }}
          className="mb-8"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all" className="gap-2">
              <Globe className="h-4 w-4" />
              전체
            </TabsTrigger>
            <TabsTrigger value="major" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              전공 동아리
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2">
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
                    className="whitespace-nowrap"
                  >
                    {department}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2 shrink-0">
                <Button
                  variant={recruitStatus === "all" ? "default" : "outline"}
                  onClick={() => setRecruitStatus("all")}
                  className="whitespace-nowrap"
                  size="sm"
                >
                  전체
                </Button>
                <Button
                  variant={
                    recruitStatus === "recruiting" ? "default" : "outline"
                  }
                  onClick={() => setRecruitStatus("recruiting")}
                  className="whitespace-nowrap"
                  size="sm"
                >
                  모집중
                </Button>
                <Button
                  variant={recruitStatus === "closed" ? "default" : "outline"}
                  onClick={() => setRecruitStatus("closed")}
                  className="whitespace-nowrap"
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
                className="whitespace-nowrap"
                size="sm"
              >
                전체
              </Button>
              <Button
                variant={recruitStatus === "recruiting" ? "default" : "outline"}
                onClick={() => setRecruitStatus("recruiting")}
                className="whitespace-nowrap"
                size="sm"
              >
                모집중
              </Button>
              <Button
                variant={recruitStatus === "closed" ? "default" : "outline"}
                onClick={() => setRecruitStatus("closed")}
                className="whitespace-nowrap"
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
            {renderClubGrid(filteredClubs)}
          </TabsContent>

          <TabsContent value="major">
            <div className="mb-6">
              <p className="text-gray-600">
                전공 동아리{" "}
                <span className="text-blue-600">{majorClubs.length}</span>개
              </p>
            </div>
            {renderClubGrid(majorClubs)}
          </TabsContent>

          <TabsContent value="general">
            <div className="mb-6">
              <p className="text-gray-600">
                일반 동아리{" "}
                <span className="text-blue-600">{generalClubs.length}</span>개
              </p>
            </div>
            {renderClubGrid(generalClubs)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

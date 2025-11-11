import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Heart, Users, Calendar, Settings } from "lucide-react";
import { mockClubs } from "../../lib/mockData";
import { toast } from "sonner";

interface ClubDetailPageProps {
  user: any;
}

export function ClubDetailPage({ user }: ClubDetailPageProps) {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [direction, setDirection] = useState(0);

  const club = mockClubs.find((c) => c.id === clubId);
  const tabs = ["about", "notices", "activities"];

  const handleTabChange = (newTab: string) => {
    const currentIndex = tabs.indexOf(activeTab);
    const newIndex = tabs.indexOf(newTab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTab);
  };

  if (!club) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p>동아리를 찾을 수 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleWishlist = () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "찜 목록에서 제거되었습니다." : "찜 목록에 추가되었습니다."
    );
  };

  const handleApply = () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    navigate(`/clubs/${clubId}/apply`);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const transition = {
    x: { type: "spring", stiffness: 400, damping: 40 },
    opacity: { duration: 0.15 },
  };

  const fallbackImg = "/default-club.jpg"; // 필요 시 public 폴더에 기본 이미지 추가

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <motion.div
        className="relative h-80 overflow-hidden bg-gray-900"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={club.imageUrl}
          alt={club.name}
          onError={(e) => ((e.target as HTMLImageElement).src = fallbackImg)}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <motion.div
          className="absolute bottom-0 left-0 right-0"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="container mx-auto px-4 pb-8">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Badge className="bg-white/90 text-gray-900">
                    {club.category}
                  </Badge>
                  {club.isRecruiting && (
                    <Badge className="bg-green-600">모집중</Badge>
                  )}
                </div>
                <h1 className="mb-2 text-white">{club.name}</h1>
                <p className="text-lg text-gray-200">{club.shortDescription}</p>
              </div>

              <div className="flex gap-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/90"
                    onClick={handleWishlist}
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                </motion.div>
                {user && club.adminId === user.id && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white/90"
                      onClick={() => navigate(`/clubs/${clubId}/manage`)}
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <motion.div
            className="lg:col-span-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-full">
              <div className="mb-6 flex gap-2 border-b">
                <button
                  onClick={() => handleTabChange("about")}
                  className={`px-4 py-2 text-center transition-all ${
                    activeTab === "about"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  소개
                </button>
                <button
                  onClick={() => handleTabChange("notices")}
                  className={`px-4 py-2 text-center transition-all ${
                    activeTab === "notices"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  공지사항
                </button>
                <button
                  onClick={() => handleTabChange("activities")}
                  className={`px-4 py-2 text-center transition-all ${
                    activeTab === "activities"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  활동 내역
                </button>
              </div>
              <div className="relative overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  {activeTab === "about" && (
                    <motion.div
                      key="about"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={transition}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>동아리 소개</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h3 className="mb-2">상세 설명</h3>
                            <p className="text-gray-600">{club.description}</p>
                          </div>

                          <div>
                            <h3 className="mb-2">활동 방향성</h3>
                            <p className="text-gray-600">{club.direction}</p>
                          </div>

                          <div>
                            <h3 className="mb-3">태그</h3>
                            <div className="flex flex-wrap gap-2">
                              {club.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === "notices" && (
                    <motion.div
                      key="notices"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={transition}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>공지사항</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {club.notices && club.notices.length > 0 ? (
                            <div className="space-y-4">
                              {club.notices.map((notice) => (
                                <div
                                  key={notice.id}
                                  className="rounded-lg border p-4 hover:bg-gray-50"
                                >
                                  <div className="mb-2 flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                      {notice.isImportant && (
                                        <Badge className="bg-red-600">
                                          중요
                                        </Badge>
                                      )}
                                      <h3 className="line-clamp-1">
                                        {notice.title}
                                      </h3>
                                    </div>
                                    <span className="shrink-0 text-sm text-gray-500">
                                      {notice.date}
                                    </span>
                                  </div>
                                  <p className="whitespace-pre-wrap text-sm text-gray-600">
                                    {notice.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-12 text-center text-gray-500">
                              등록된 공지사항이 없습니다.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === "acitivities" && (
                    <motion.div
                      key="activities"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={transition}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>주요 활동</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {club.activities.map((acitvity, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="mt-1 h-2 w-2 shrink-0 rounded-fulll bg-blue-600" />
                                <span className="text-gray-600">
                                  {acitvity}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>추천 동아리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockClubs
                  .filter(
                    (c) => c.id !== clubId && c.category === club.category
                  )
                  .slice(0, 2)
                  .map((relatedClub) => (
                    <div
                      key={relatedClub.id}
                      className="cursor-pointer space-y-2 border-b pb-4 last:border-0"
                      onClick={() => navigate(`/clubs/${relatedClub.id}`)}
                    >
                      <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={relatedClub.imageUrl}
                          alt={relatedClub.name}
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src = fallbackImg)
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="line-clamp-1">{relatedClub.name}</p>
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {relatedClub.shortDescription}
                      </p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

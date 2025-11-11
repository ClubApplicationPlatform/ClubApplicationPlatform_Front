import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { useState } from "react";
import { type Club } from "../../lib/mockData";

interface ClubHeroProps {
  club: Club;
}

export default function ClubDetailPageHero({ club }: ClubHeroProps) {
  const [direction, setDirection] = useState(0);
  const tabs = ["about", "notices", "activities"];
  const [activeTab, setActiveTab] = useState("about");

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

  const handleTabChange = (newTab: string) => {
    const currentIndex = tabs.indexOf(activeTab);
    const newIndex = tabs.indexOf(newTab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTab);
  };

  const transition = {
    x: { type: "spring", stiffness: 400, damping: 40 },
    opacity: { duration: 0.15 },
  };

  return (
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
                                  <Badge className="bg-red-600">중요</Badge>
                                )}
                                <h3 className="line-clamp-1">{notice.title}</h3>
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

            {activeTab === "activities" && (
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
                      {club.activities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                          <span className="text-gray-600">{activity}</span>
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
  );
}

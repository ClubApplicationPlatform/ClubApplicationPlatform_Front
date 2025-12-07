import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { Heart, Settings } from "lucide-react";
import { mockClubs } from "../../lib/mockData";
import { toast } from "sonner";
import ClubDetailPageSideBar from "../../components/club/ClubDetailPageSideBar";
import ClubDetailPageHero from "../../components/club/ClubDetailPageHero";
import { useAuthStore } from "../../stores/authStore";
import { useActiveCampus } from "../../hooks/useActiveCampus";

const LoadingState = () => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    <p className="text-gray-600">동아리 정보를 불러오는 중입니다...</p>
  </div>
);

export function ClubDetailPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const campus = useActiveCampus();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [club, setClub] = useState(() =>
    mockClubs.find((c) => c.id === clubId)
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchClub = async () => {
      if (!clubId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://clubapplicationplatform-server.onrender.com/api/clubs/${clubId}`,
          { headers: { accept: "*/*" } }
        );
        const body = (await response.json().catch(() => null)) as
          | {
              clubId?: number | string;
              name?: string;
              shortDesc?: string;
              description?: string;
              type?: string;
              department?: string;
              category?: string;
              recruitStatus?: string;
              images?: string[];
            }
          | null;

        const ok = response.ok && body;
        if (!ok || !body) {
          throw new Error("Failed to load club");
        }

        const isRecruiting =
          (body.recruitStatus ?? "").toString().toLowerCase() === "open";
        const mapped = {
          id: String(body.clubId ?? clubId),
          name: body.name ?? "이름 미정",
          type:
            body.type === "major" || body.type === "general"
              ? (body.type as "major" | "general")
              : ("general" as const),
          category: body.category ?? "기타",
          department: body.department ?? "미정",
          adminId: "",
          campusId: campus?.id ?? "yonam",
          shortDescription: body.shortDesc ?? "소개가 준비 중입니다.",
          description: body.description ?? "",
          direction: "",
          imageUrl: body.images?.[0] ?? "/fallback.png",
          members: 0,
          tags: [],
          isRecruiting,
          recruitDeadline: "",
          notices: [],
          activities: [],
        };
        if (!cancelled) {
          setClub(mapped);
        }
      } catch (error) {
        console.error("클럽 상세 불러오기 실패, mock 데이터 사용", error);
        if (!cancelled) {
          setClub(mockClubs.find((c) => c.id === clubId));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchClub();
    return () => {
      cancelled = true;
    };
  }, [campus?.id, clubId]);

  const resolvedClub = club;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent>
            <LoadingState />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!resolvedClub) {
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

  if (campus && resolvedClub.campusId !== campus.id) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4">{campus.name} 학생은 다른 학교 동아리 정보예요.</p>
            <Button onClick={() => navigate("/clubs")}>동아리 목록으로 이동</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleWishlist = () => {
    if (!user) {
      toast.error("로그인이 필요해요.");
      navigate("/login");
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "찜목록에서 제거했어요." : "찜목록에 추가했어요."
    );
  };

  const handleApply = () => {
    if (!user) {
      toast.error("로그인이 필요해요.");
      navigate("/login");
      return;
    }
    navigate(`/clubs/${resolvedClub.id}/apply`);
  };

  const fallbackImg = "/default-club.jpg";

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
          src={resolvedClub.imageUrl}
          alt={resolvedClub.name}
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
                    {resolvedClub.category}
                  </Badge>
                  {resolvedClub.isRecruiting && (
                    <Badge className="bg-green-600">모집중</Badge>
                  )}
                </div>
                <h1 className="mb-2 text-white">{resolvedClub.name}</h1>
                <p className="text-lg text-gray-200">
                  {resolvedClub.shortDescription}
                </p>
              </div>

              <div className="flex gap-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/90 hover:cursor-pointer"
                    onClick={handleWishlist}
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                </motion.div>
                {user && resolvedClub.adminId === user.id && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white/90 hover:cursor-pointer"
                      onClick={() => navigate(`/clubs/${resolvedClub.id}/manage`)}
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
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          <ClubDetailPageHero club={resolvedClub} />
          <ClubDetailPageSideBar club={resolvedClub} onApply={handleApply} />
        </div>
      </div>
    </motion.div>
  );
}

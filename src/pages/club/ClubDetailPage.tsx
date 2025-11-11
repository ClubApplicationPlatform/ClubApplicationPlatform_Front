import { useState } from "react";
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

interface ClubDetailPageProps {
  user: any;
}

export function ClubDetailPage({ user }: ClubDetailPageProps) {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const club = mockClubs.find((c) => c.id === clubId);

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
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          <ClubDetailPageHero club={club} />
          <ClubDetailPageSideBar club={club} onApply={handleApply} />
        </div>
      </div>
    </motion.div>
  );
}

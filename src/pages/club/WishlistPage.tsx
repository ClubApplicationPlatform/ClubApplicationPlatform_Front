import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent } from "../../ui/card";
import { mockClubs } from "../../lib/mockData";
import { WishlistGrid } from "../../components/wishlist/WishlistGrid";
import { WishlistEmptyState } from "../../components/wishlist/WishlistEmptyState";
import { useAuthStore } from "../../stores/authStore";

export function WishlistPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const wishlistedClubs = mockClubs.slice(0, 3);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p>로그인이 필요합니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleViewClub = (clubId: string) => navigate(`/clubs/${clubId}`);
  const handleApplyClub = (clubId: string) => navigate(`/clubs/${clubId}/apply`);
  const handleToggleWishlist = () =>
    toast.info("찜 기능은 곧 제공될 예정입니다.");

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">찜한 동아리</h1>
        <p className="text-gray-600">관심있는 동아리를 한 눈에 모아보세요.</p>
      </div>

      {wishlistedClubs.length > 0 ? (
        <WishlistGrid
          clubs={wishlistedClubs}
          onViewClub={handleViewClub}
          onApplyClub={handleApplyClub}
          onToggleWishlist={handleToggleWishlist}
        />
      ) : (
        <WishlistEmptyState onExploreClubs={() => navigate("/clubs")} />
      )}
    </div>
  );
}

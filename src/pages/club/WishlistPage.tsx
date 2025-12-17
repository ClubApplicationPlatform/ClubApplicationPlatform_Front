import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { getClubsForCampus } from "../../lib/mockData";
import {
  getLocalWishlist,
  toggleLocalWishlist,
  LOCAL_WISHLISTS_EVENT,
} from "../../lib/localWishlists";
import { WishlistGrid } from "../../components/wishlist/WishlistGrid";
import { WishlistEmptyState } from "../../components/wishlist/WishlistEmptyState";
import { useAuthStore } from "../../stores/authStore";
import { useActiveCampus } from "../../hooks/useActiveCampus";

export function WishlistPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const campus = useActiveCampus();

  const campusClubs = useMemo(
    () => getClubsForCampus(campus?.id ?? user?.campusId ?? null),
    [campus?.id, user?.campusId]
  );

  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    user ? getLocalWishlist(user.id) : []
  );

  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }
    const refresh = () => setWishlistIds(getLocalWishlist(user.id));
    refresh();
    if (typeof window === "undefined") {
      return;
    }
    window.addEventListener(LOCAL_WISHLISTS_EVENT, refresh);
    return () => {
      window.removeEventListener(LOCAL_WISHLISTS_EVENT, refresh);
    };
  }, [user]);

  const wishlistedClubs = useMemo(
    () => campusClubs.filter((club) => wishlistIds.includes(club.id)),
    [campusClubs, wishlistIds]
  );

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

  if (!campus) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4">학교 정보가 확인되지 않았어요.</p>
            <Button onClick={() => navigate("/login")}>다시 로그인</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleViewClub = (clubId: string) => navigate(`/clubs/${clubId}`);
  const handleApplyClub = (clubId: string) =>
    navigate(`/clubs/${clubId}/apply`);
  const handleToggleWishlist = (clubId: string) => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    const { isWishlisted } = toggleLocalWishlist(user.id, clubId);
    toast.success(
      isWishlisted ? "찜 목록에 추가했어요." : "찜 목록에서 제거했어요."
    );
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">찜한 동아리</h1>
        <p className="text-gray-600">관심있는 동아리를 한 눈에 모아보세요.</p>
      </div>

      {wishlistedClubs.length > 0 ? (
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          <WishlistGrid
            clubs={wishlistedClubs}
            onViewClub={handleViewClub}
            onApplyClub={handleApplyClub}
            onToggleWishlist={handleToggleWishlist}
          />
        </div>
      ) : (
        <WishlistEmptyState onExploreClubs={() => navigate("/clubs")} />
      )}
    </div>
  );
}

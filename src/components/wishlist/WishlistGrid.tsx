import type { Club } from "../../lib/mockData";
import { WishlistClubCard } from "./WishlistClubCard";

interface WishlistGridProps {
  clubs: Club[];
  onViewClub: (clubId: string) => void;
  onApplyClub?: (clubId: string) => void;
  onToggleWishlist?: (clubId: string) => void;
}

export function WishlistGrid({
  clubs,
  onViewClub,
  onApplyClub,
  onToggleWishlist,
}: WishlistGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {clubs.map((club) => (
        <WishlistClubCard
          key={club.id}
          club={club}
          onViewClub={onViewClub}
          onApplyClub={onApplyClub}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}

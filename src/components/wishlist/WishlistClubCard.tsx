import { Heart } from "lucide-react";

import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import type { Club } from "../../lib/mockData";
import { ImageWithFallback } from "../common/ImageWithFallback";

interface WishlistClubCardProps {
  club: Club;
  onViewClub: (clubId: string) => void;
  onApplyClub?: (clubId: string) => void;
  onToggleWishlist?: (clubId: string) => void;
}

export function WishlistClubCard({
  club,
  onViewClub,
  onApplyClub,
  onToggleWishlist,
}: WishlistClubCardProps) {
  const handleView = () => onViewClub(club.id);
  const handleApply = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onApplyClub?.(club.id);
  };
  const handleToggleWishlist = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleWishlist?.(club.id);
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={handleView}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={club.imageUrl}
          alt={club.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {club.isRecruiting && (
          <Badge className="absolute right-3 top-3 bg-green-600">모집중</Badge>
        )}
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={handleToggleWishlist}
          className="absolute left-3 top-3 bg-white/90"
        >
          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        </Button>
      </div>

      <CardContent className="p-5">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="line-clamp-1 text-lg font-semibold">{club.name}</h3>
          <Badge variant="outline" className="ml-2 shrink-0">
            {club.category}
          </Badge>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {club.shortDescription}
        </p>

        <div className="flex gap-2">
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleView();
            }}
            className="flex-1"
          >
            상세보기
          </Button>
          <Button
            onClick={handleApply}
            variant="outline"
            className="flex-1"
            disabled={!club.isRecruiting}
          >
            {club.isRecruiting ? "지원하기" : "모집 마감"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

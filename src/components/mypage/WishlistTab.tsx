import { Heart } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";

import type { Club } from "../../lib/mockData";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { ImageWithFallback } from "../common/ImageWithFallback";

interface WishlistTabProps {
  clubs: Club[];
  onNavigate: NavigateFunction;
  onToggleWishlist?: (clubId: string) => void;
}

export function WishlistTab({
  clubs,
  onNavigate,
  onToggleWishlist,
}: WishlistTabProps) {
  if (clubs.length === 0) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="mb-4 text-gray-500">찜한 동아리가 없습니다.</p>
          <Button onClick={() => onNavigate("/clubs")}>동아리 둘러보기</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
      {clubs.map((club) => (
        <Card
          key={club.id}
          className="group overflow-hidden transition-all hover:shadow-lg"
        >
          <div className="relative aspect-video overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={club.imageUrl}
              alt={club.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            {club.isRecruiting && (
              <Badge className="absolute right-3 top-3 bg-green-600 text-white">
                모집중
              </Badge>
            )}
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="absolute left-3 top-3 bg-white/90 hover:cursor-pointer"
              aria-label="찜 해제"
              onClick={(event) => {
                event.stopPropagation();
                onToggleWishlist?.(club.id);
              }}
            >
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            </Button>
          </div>

          <CardContent className="p-5">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="line-clamp-1 text-base font-semibold">
                {club.name}
              </h3>
              <Badge variant="outline" className="ml-2 shrink-0">
                {club.category}
              </Badge>
            </div>

            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
              {club.shortDescription}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={() => onNavigate(`/clubs/${club.id}`)}
                className="flex-1 hover:cursor-pointer"
              >
                상세보기
              </Button>
              <Button
                onClick={() => onNavigate(`/clubs/${club.id}/apply`)}
                variant="outline"
                className={`flex-1 ${club.isRecruiting ? "hover:cursor-pointer" : ""}`}
                disabled={!club.isRecruiting}
              >
                {club.isRecruiting ? "지원하기" : "모집 마감"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

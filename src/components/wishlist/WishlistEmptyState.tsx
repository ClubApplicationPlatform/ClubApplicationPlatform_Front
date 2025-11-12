import { Heart } from "lucide-react";

import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";

interface WishlistEmptyStateProps {
  onExploreClubs: () => void;
}

export function WishlistEmptyState({ onExploreClubs }: WishlistEmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-20 text-center">
        <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <p className="mb-4 text-gray-500">찜한 동아리가 없습니다.</p>
        <Button onClick={onExploreClubs}>동아리 둘러보기</Button>
      </CardContent>
    </Card>
  );
}

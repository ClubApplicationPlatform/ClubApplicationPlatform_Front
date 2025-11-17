import { Heart } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";

import type { WishlistedProject } from "../../lib/mockData";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { ImageWithFallback } from "../common/ImageWithFallback";

interface WishlistTabProps {
  projects: WishlistedProject[];
  onNavigate: NavigateFunction;
}

export function WishlistTab({ projects, onNavigate }: WishlistTabProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="mb-4 text-gray-500">찜한 프로젝트가 없습니다.</p>
          <Button onClick={() => onNavigate("/clubs")}>동아리 둘러보기</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
        >
          <div className="relative aspect-video overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={project.thumbnail}
              alt={project.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              <Badge variant="secondary" className="bg-white/90 text-gray-900">
                {project.status}
              </Badge>
              {project.isRecruiting && (
                <Badge className="bg-green-600 text-white">모집중</Badge>
              )}
            </div>
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full border bg-white/90 p-2 text-red-500 shadow-sm"
              aria-label="찜 해제"
            >
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            </button>
          </div>

          <CardContent className="p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500">{project.clubName}</p>
                <h3 className="line-clamp-1 text-base font-semibold">
                  {project.title}
                </h3>
              </div>
              <Badge variant="outline" className="shrink-0">
                {project.category}
              </Badge>
            </div>

            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
              {project.description}
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => onNavigate(`/clubs/${project.clubId}`)}
                className="flex-1"
              >
                프로젝트 보기
              </Button>
              {project.isRecruiting && (
                <Button
                  onClick={() => onNavigate(`/clubs/${project.clubId}/apply`)}
                  variant="outline"
                  className="flex-1"
                >
                  지원하기
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { useNavigate } from "react-router-dom";
import { Users, Calendar } from "lucide-react";
import { type Club } from "../../lib/mockData";

interface ClubGrid {
  selectedType: string;
  selectedDepartment: string;
  recruitStatus: string;
  searchQuery: string;
  clubs: Club[];
}

export default function ClubGrid({
  selectedType,
  selectedDepartment,
  recruitStatus,
  searchQuery,
  clubs,
}: ClubGrid) {
  const navigate = useNavigate();

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={`${selectedType}-${selectedDepartment}-${recruitStatus}-${searchQuery}`}
        className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {clubs.map((club) => (
          <motion.div
            key={club.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Card
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg h-full"
              onClick={() => navigate(`/clubs/${club.id}`)}
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                  src={club.imageUrl}
                  alt={club.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/fallback.png";
                  }}
                  loading="lazy"
                />
                {club.isRecruiting && (
                  <Badge className="absolute right-3 top-3 bg-green-600">
                    모집중
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="absolute left-3 top-3 bg-white/90"
                >
                  {club.type === "major" ? club.department : "일반"}
                </Badge>
              </div>

              <CardContent className="p-5">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="line-clamp-1">{club.name}</h3>
                  {club.type === "general" && (
                    <Badge variant="outline" className="ml-2 shrink-0">
                      {club.category}
                    </Badge>
                  )}
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {club.shortDescription}
                </p>

                <div className="mb-3 flex flex-wrap gap-1">
                  {club.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t pt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{club.members}명</span>
                  </div>
                  {club.isRecruiting && club.recruitDeadline && (
                    <div className="flex items-center gap-1 text-red-600">
                      <Calendar className="h-4 w-4" />
                      <span>{club.recruitDeadline}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {clubs.length === 0 && (
          <motion.div
            className="col-span-full py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

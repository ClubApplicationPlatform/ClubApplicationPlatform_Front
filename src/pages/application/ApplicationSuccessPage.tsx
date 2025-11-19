import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { mockClubs } from "../../lib/mockData";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { useActiveCampus } from "../../hooks/useActiveCampus";

export function ApplicationSuccessPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const campus = useActiveCampus();

  const club = useMemo(
    () => mockClubs.find((entry) => entry.id === clubId),
    [clubId]
  );
  const canDisplayClub =
    club && campus ? club.campusId === campus.id : Boolean(club);

  const handleExplore = () => {
    navigate("/clubs");
  };

  const handleViewApplications = () => {
    navigate("/my/applications");
  };

  const handleGoToClub = () => {
    if (canDisplayClub && club) {
      navigate(`/clubs/${club.id}`);
      return;
    }
    navigate("/clubs");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <Card className="w-full max-w-3xl border-blue-100 shadow-xl">
          <CardContent className="space-y-10 p-10 text-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
              className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"
            >
              <CheckCircle2 className="size-10" />
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-slate-900">
                지원이 완료되었어요!
              </h1>
              <p className="text-base text-slate-600">
                {canDisplayClub && club
                  ? `${club.name} 지원서가 정상적으로 제출되었으며, 결과가 안내될 때까지 기다려 주세요.`
                  : "지원서가 정상적으로 제출되었습니다. 결과는 마이페이지에서 확인할 수 있어요."}
              </p>
            </div>

            {canDisplayClub && club && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-left">
                <p className="text-sm font-semibold text-blue-700">
                  지원 중인 동아리
                </p>
                <p className="text-xl font-bold text-blue-900">{club.name}</p>
                <p className="text-sm text-blue-700">{club.shortDescription}</p>
                <Button
                  variant="link"
                  className="mt-2 p-0 text-blue-700 hover:cursor-pointer"
                  onClick={handleGoToClub}
                >
                  동아리 소개 페이지로 이동
                </Button>
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              <Button
                variant="secondary"
                className="h-14 text-base hover:cursor-pointer"
                onClick={handleExplore}
              >
                다른 동아리 둘러보기
              </Button>
              <Button
                className="h-14 text-base hover:cursor-pointer"
                onClick={handleViewApplications}
              >
                내 지원 현황 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

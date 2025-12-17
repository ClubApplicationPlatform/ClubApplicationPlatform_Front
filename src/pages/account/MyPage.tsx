import { useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

import { ApplicationsTab } from "../../components/mypage/ApplicationsTab";

import { MyPageTabs } from "../../components/mypage/MyPageTabs";

import { ProfileTab } from "../../components/mypage/ProfileTab";

import { WishlistTab } from "../../components/mypage/WishlistTab";

import { getClubsForCampus } from "../../lib/mockData";
import { getApplicationsForUser } from "../../lib/applications";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { useActiveCampus } from "../../hooks/useActiveCampus";
import {
  getLocalWishlist,
  toggleLocalWishlist,
  LOCAL_WISHLISTS_EVENT,
} from "../../lib/localWishlists";

type TabId = "profile" | "applications" | "wishlist";



const TABS: { id: TabId; label: string }[] = [

  { id: "profile", label: "프로필" },

  { id: "applications", label: "내 신청현황" },

  { id: "wishlist", label: "찜 목록" },

];



const slideVariants = {

  enter: (direction: number) => ({

    x: direction > 0 ? 300 : -300,

    opacity: 0,

  }),

  center: {

    zIndex: 1,

    x: 0,

    opacity: 1,

  },

  exit: (direction: number) => ({

    zIndex: 0,

    x: direction < 0 ? 300 : -300,

    opacity: 0,

  }),

};



const transition = {

  x: { type: "spring", stiffness: 400, damping: 40 },

  opacity: { duration: 0.15 },

};



export function MyPage() {

  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const campus = useActiveCampus();

  const campusClubs = useMemo(

    () => getClubsForCampus(campus?.id ?? user?.campusId ?? null),

    [campus?.id, user?.campusId]

  );

  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const [direction, setDirection] = useState(0);

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



  if (!user) {

    return (

      <div className="container mx-auto max-w-2xl px-4 py-12">

        <Card>

          <CardContent className="py-12 text-center">

            <p className="mb-4 text-gray-600">로그인이 필요한 페이지예요.</p>

            <Button onClick={() => navigate('/login')}>로그인하러 가기</Button>

          </CardContent>

        </Card>

      </div>

    );

  }



  if (!campus) {

    return (

      <div className="container mx-auto max-w-2xl px-4 py-12">

        <Card>

          <CardContent className="py-12 text-center">

            <p className="mb-4 text-gray-600">학교 정보를 찾을 수 없어요.</p>

            <Button onClick={() => navigate('/login')}>다시 로그인하기</Button>

          </CardContent>

        </Card>

      </div>

    );

  }



  const handleTabChange = (incomingTab: string) => {
    if (!["profile", "applications", "wishlist"].includes(incomingTab)) {
      return;
    }
    const tabId = incomingTab as TabId;
    if (tabId === activeTab) {
      return;
    }


    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);

    const nextIndex = TABS.findIndex((tab) => tab.id === tabId);

    setDirection(nextIndex > currentIndex ? 1 : -1);

    setActiveTab(tabId);

  };



  const wishlistedClubs = useMemo(
    () => campusClubs.filter((club) => wishlistIds.includes(club.id)),
    [campusClubs, wishlistIds]
  );

  const userApplications = getApplicationsForUser(user.id);

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

    <div className="container mx-auto max-w-5xl px-4 py-12">

      <div className="mb-8">

        <h1 className="mb-2 text-2xl font-semibold">마이페이지</h1>

        <p className="text-gray-600">내 정보와 활동을 관리하세요</p>

      </div>



      <div className="w-full">

        <MyPageTabs

          tabs={TABS}

          activeTab={activeTab}

          onChange={handleTabChange}

        />



        <div className="relative overflow-hidden">

          <AnimatePresence initial={false} custom={direction} mode="wait">

            {activeTab === "profile" && (

              <motion.div

                key="profile"

                custom={direction}

                variants={slideVariants}

                initial="enter"

                animate="center"

                exit="exit"

                transition={transition}

              >

                <ProfileTab user={user} />

              </motion.div>

            )}



            {activeTab === "applications" && (

              <motion.div

                key="applications"

                custom={direction}

                variants={slideVariants}

                initial="enter"

                animate="center"

                exit="exit"

                transition={transition}

              >

                <ApplicationsTab

                  applications={userApplications}

                  onNavigate={navigate}

                />

              </motion.div>

            )}



            {activeTab === "wishlist" && (

              <motion.div

                key="wishlist"

                custom={direction}

                variants={slideVariants}

                initial="enter"

                animate="center"

                exit="exit"

                transition={transition}

              >

                <WishlistTab
                  clubs={wishlistedClubs}
                  onNavigate={navigate}
                  onToggleWishlist={handleToggleWishlist}
                />

              </motion.div>

            )}

          </AnimatePresence>

        </div>

      </div>

    </div>

  );

}

import  { useId, useMemo, useState } from "react";
import type { Club,Category } from "../types/club";
import SearchIcon from "../components/ui/SearchIcon";
import GearIcon from "../components/ui/GearIcon";
import UserIcon from "../components/ui/UserIcon";
import ClubCard from "../components/form/ClubCard";

// ── Mock Data ──────────────────────────────────────────────────────
const CLUBS: Club[] = [
  { id: "erpro-1", name: "ERPro", category: "전공 동아리", summary: "동아리 소개", status: "모집중", members: 20, updated: "2025.08.20" },
  { id: "openai-1", name: "Open AI", category: "전공 동아리", summary: "동아리 소개", status: "모집 종료", members: 25, updated: "2025.08.20" },
  { id: "triples-1", name: "TripleS", category: "전공 동아리", summary: "동아리 소개", status: "모집중", members: 21, updated: "2025.08.20" },
  { id: "dp-1", name: "Digital Playground", category: "전공 동아리", summary: "동아리 소개", status: "모집 종료", members: 10, updated: "2025.08.20" },
  { id: "erpro-2", name: "ERPro", category: "일반 동아리", summary: "동아리 소개", status: "모집중", members: 17, updated: "2025.08.20" },
  { id: "openai-2", name: "Open AI", category: "일반 동아리", summary: "동아리 소개", status: "모집중", members: 18, updated: "2025.08.20" },
  { id: "triples-2", name: "TripleS", category: "일반 동아리", summary: "동아리 소개", status: "모집 종료", members: 18, updated: "2025.08.20" },
  { id: "dp-2", name: "Digital Playground", category: "일반 동아리", summary: "동아리 소개", status: "모집중", members: 20, updated: "2025.08.20" },
];

export default function JoinUsClubsPage() {
  const [activeTab, setActiveTab] = useState<Category>("전공 동아리");
  const [query, setQuery] = useState("");
  const searchId = useId();

  const filtered = useMemo(() => {
    const base = CLUBS.filter((c) => c.category === activeTab);
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter((c) => c.name.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q));
  }, [activeTab, query]);

  return (
    <div
      style={{ backgroundImage: "url('/assets/JoinUs_Background.png')" }}
      className="w-full min-h-[100vh] md:min-h-dvh bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
    >
      <div className="bg-white flex-col w-[90vw] h-[90vh] flex items-center justify-center rounded-2xl shadow-lg ">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 h-[100%] w-[100%]">
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
            <img src="/assets/JoinUs_Logo.png" className="w-[48px] h-[48px] ml-5"/>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">JoinUs</div>
                <div className="text-xs text-gray-500">연암공과대학교</div>
              </div>
            </div>

            <img src="/assets/UserProfile.png" className="w-[48px] h-[48px] mr-8"/>
          </header>

          <main className="flex flex-col items-center justify-center w-full h-[95%] bg-red-100">

            <section className="flex flex-row items-center justify-between bg-blue-300 w-[100%] h-[90px] ">
              <div className="flex flex-row">
                <div className="w-[100px] h-[60px] bg-red-200 flex items-center justify-center">
                  전공 동아리
                </div>
                <div className="w-[100px] h-[60px] bg-red-200 flex items-center justify-center">
                  일반 동아리
                </div>
              </div>

              <div className="relatice">
                <input type="search" placeholder="동아리를 검색해보세요..." autoComplete="off" value={query} onChange={(e) => {
                  setQuery(e.target.value);
                }}
                  className="w-[300px] h-8 rounded-[6px] bg-white/70 pl-10 pr-4 ring-1 ring-gray-300 shadow-sm placeholder:text-gray-400 outline-none"
                />
                <img src="/assets/SearchIcon.png" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60"/>
              </div>
            </section>
            <section className="flex items-center justify-center bg-gray-500 w-[100%] h-[85%]">

            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

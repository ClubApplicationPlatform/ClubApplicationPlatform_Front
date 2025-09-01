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

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void }
function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-300"}`}
      aria-label="theme toggle"
      aria-pressed={checked}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );
}


export default function JoinUsClubsPage() {
  const [themeDark, setThemeDark] = useState(false);
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
      className={`${themeDark ? "bg-gray-950" : "bg-gray-50"} h-[100vh] w-[100vw] bg-cover bg-center bg-no-repeat flex items-center justify-center relative`}
      style={{ backgroundImage: "url('/assets/JoinUs_Background.png')" }}
    >
      <div className={`${themeDark ? "bg-[white]" : "bg-[white]"} h-[85vh] w-[85vw] flex items-center justify-center rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}>
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-8">
          {/* <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <span className="text-xl font-black">U</span>
              </div>
              <div>
                <div className={`text-2xl font-extrabold ${themeDark ? "text-white" : "text-gray-900"}`}>JoinUs</div>
                <div className="text-xs text-gray-500">연암공과대학교</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Toggle checked={themeDark} onChange={setThemeDark} />
              <button type="button" className={`rounded-full p-2 ${themeDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`} aria-label="settings">
                <GearIcon />
              </button>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${themeDark ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700"}`} aria-hidden>
                <UserIcon />
              </div>
            </div>
          </header>

          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              {(["전공 동아리", "일반 동아리"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-sm"
                      : themeDark
                      ? "bg-gray-800 text-gray-200 ring-1 ring-gray-700"
                      : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
                  }`}
                  aria-pressed={activeTab === tab}
                >
                  {tab}
                </button>
              ))}
            </div>

            <label htmlFor={searchId} className="sr-only">동아리 검색</label>
            <div className={`flex w-full max-w-sm items-center gap-2 rounded-xl px-3 py-2 ring-1 sm:w-80 ${themeDark ? "bg-gray-900 ring-gray-800 text-gray-200" : "bg-white ring-gray-200 text-gray-700"}`}>
              <SearchIcon />
              <input
                id={searchId}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="동아리를 검색해보세요..."
                className={`h-7 w-full bg-transparent text-sm outline-none placeholder:text-gray-400 ${themeDark ? "text-gray-100" : "text-gray-900"}`}
              />
            </div>
          </div>

          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
            {filtered.length === 0 && (
              <div className={`col-span-full rounded-2xl p-10 text-center ${themeDark ? "bg-gray-900 text-gray-300" : "bg-white text-gray-500"}`}>
                검색 결과가 없습니다.
              </div>
            )}
          </section> */}
        </div>
      </div>
    </div>
  );
}

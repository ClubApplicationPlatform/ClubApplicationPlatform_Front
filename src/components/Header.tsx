import { useEffect, useState, type KeyboardEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Logo from "../../public/assets/JoinUs_Logo.png";
import { useAuthStore } from "../stores/authStore";
import { Search, UserRound } from "lucide-react";
import { Input } from "../ui/input";
import { useClubSearchStore } from "../stores/clubSearchStore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));
  const isAdmin = user?.role === "admin";

  const { query, setQuery } = useClubSearchStore();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openMenuLinks = [
    { label: "공지사항", path: "/notices" },
    { label: "FAQ", path: "/faq" },
    { label: "알림", path: "/notifications" },
    { label: "마이페이지", path: "/mypage" },
  ];
  const menuLinks = isAdmin
    ? [...openMenuLinks, { label: "관리자 대시보드", path: "/admin" }]
    : openMenuLinks;

  const handleMenuNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleMenuLogout = () => {
    setIsMenuOpen(false);
    handleLogout();
  };

  const runSearch = () => {
    const nextQuery = searchInput.trim();
    setQuery(nextQuery);
    if (!location.pathname.startsWith("/clubs")) {
      navigate("/clubs");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/clubs" className="flex items-center gap-2">
          <img src={Logo} className="h-8 w-8" />
          <span className="text-xl font-semibold">JoinUs</span>
        </Link>

        <nav className="flex flex-1 justify-center px-4">
          <div className="relative w-full max-w-3xl">
            <Input
              placeholder="동아리 이름을 검색해보세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-11 w-full border-gray-200 bg-white pl-4 pr-14 text-gray-900"
            />
            <button
              type="button"
              onClick={runSearch}
              className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md bg-blue-600 p-2 text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="\uAC80\uC0C9 \uC2E4\uD589"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <PopoverTrigger asChild>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:cursor-pointer"
                  aria-label="\uC0AC\uC6A9\uC790 \uBA54\uB274 \uC5F4\uAE30"
                >
                  <UserRound className="h-5 w-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-52 border-gray-200 p-2">
                <div className="flex flex-col gap-1">
                  {menuLinks.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleMenuNavigate(item.path)}
                      className="rounded-md px-3 py-2 text-left text-sm text-gray-800 transition hover:bg-gray-100 hover:cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={handleMenuLogout}
                    className="rounded-md px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    로그아웃
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hover:cursor-pointer border-gray-200"
                onClick={() => navigate("/login")}
              >
                로그인
              </Button>
              <Button
                className="hover:cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

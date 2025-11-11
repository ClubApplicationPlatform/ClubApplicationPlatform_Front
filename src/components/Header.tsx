import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Logo from "../../public/assets/JoinUs_Logo.png";

interface HeaderProps {
  user: any;
  setUser: (user: any) => void;
}

export function Header({ user, setUser }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/clubs" className="flex items-center gap-2">
          <img src={Logo} className="h-8 2-8 rounded-lg" />
          <span className="text-xl">JoinUs</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/clubs" className="text-gray-700 hover:text-gray-900">
            동아리 찾기
          </Link>
          <Link to="/notices" className="text-gray-700 hover:text-gray-900">
            공지사항
          </Link>
          <Link to="/faq" className="text-gray-700 hover:text-gray-900">
            FAQ
          </Link>

          {user && (
            <>
              <Link
                to="/notifications"
                className="text-gray-700 hover:text-gray-900"
              >
                알림
              </Link>
              <Link to="/my-page" className="text-gray-700 hover:text-gray-900">
                마이페이지
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="text-gray-700 hover:text-gray-900">
                  관리자
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="hover:cursor-pointer"
            >
              로그아웃
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hover:cursor-pointer"
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

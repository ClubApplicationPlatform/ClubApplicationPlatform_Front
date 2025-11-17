import "./index.css";
import "./App.css";
import { ClubListPage } from "./pages/club/ClubListPage";
import { Header } from "./components/Header";
import { LoginPage } from "./components/auth/LoginPage";
import { ClubManagerPage } from "./pages/club/ClubManagerPage";
import { SignupPage } from "./components/auth/SignupPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ClubDetailPage } from "./pages/club/ClubDetailPage";
import { WishlistPage } from "./pages/club/WishlistPage";
import { ApplicationDetailPage } from "./pages/application/ApplicationDetailPage";
import { ApplyPage } from "./pages/application/ApplyPage";
import { MyApplicationsPage } from "./pages/application/MyApplicationsPage";
import { MyPage } from "./pages/account/MyPage";
import { NotificationCenter } from "./pages/account/NotificationCenter";
import { FAQPage } from "./pages/faq/FAQPage";

function AppContainer() {
  const location = useLocation();
  const hideHeader = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/clubs" replace />} />
        <Route
          path="/preview_page.html"
          element={<Navigate to="/clubs" replace />}
        />
        <Route path="/clubs" element={<ClubListPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/clubs/:clubId/manage" element={<ClubManagerPage />} />
        <Route path="/clubs/:clubId/apply" element={<ApplyPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/applications/:applicationId" element={<ApplicationDetailPage />} />
        <Route path="/my/applications" element={<MyApplicationsPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="*" element={<Navigate to="/clubs" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContainer />
    </Router>
  );
}

export default App;

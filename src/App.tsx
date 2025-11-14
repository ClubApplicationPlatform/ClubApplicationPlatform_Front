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
import { ApplicantDetailPage } from "./pages/application/ApplicantDetailPage";

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
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/applications/:applicationId" element={<ApplicantDetailPage />} />
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

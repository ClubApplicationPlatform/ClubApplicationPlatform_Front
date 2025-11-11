import "./index.css";
import "./App.css";
import { useState } from "react";
import { ClubListPage } from "./pages/club/ClubListPage";
import { Header } from "./components/Header";
import { LoginPage } from "./components/auth/LoginPage";
import { SignupPage } from "./components/auth/SignupPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ClubDetailPage } from "./pages/club/ClubDetailPage";

function App() {
  const [user, setUser] = useState<any>(null);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Navigate to="/clubs" replace />} />
          <Route
            path="/preview_page.html"
            element={<Navigate to="/clubs" replace />}
          />
          <Route path="/clubs" element={<ClubListPage user={user} />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} />} />
          <Route
            path="/clubs/:clubId"
            element={<ClubDetailPage user={user} />}
          />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />

          <Route path="*" element={<Navigate to="/clubs" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

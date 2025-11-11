import "./index.css";
import "./App.css";
import { useState } from "react";
import { ClubListPage } from "./pages/club/ClubListPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const [user, setUser] = useState<any>(null);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/clubs" replace />} />
          <Route
            path="/preview_page.html"
            element={<Navigate to="/clubs" replace />}
          />
          <Route path="/clubs" element={<ClubListPage user={user} />} />

          <Route path="*" element={<Navigate to="/clubs" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

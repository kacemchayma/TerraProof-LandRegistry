import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import AppPage from "./pages/AppPage";
import ParcellesPage from "./pages/ParcellesPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Landing sans navbar */}
        <Route path="/" element={<Landing />} />

        {/* Application avec navbar */}
        <Route
          path="/app"
          element={
            <>
              <Navbar />
              <AppPage />
            </>
          }
        />

        <Route
          path="/parcelles"
          element={
            <>
              <Navbar />
              <ParcellesPage />
            </>
          }
        />

      </Routes>
    </Router>
  );
}

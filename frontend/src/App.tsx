import { useState } from "react";
import { Users, Cake, PartyPopper } from "lucide-react";
import MembersPage from "./pages/MembersPage";
import UpcomingBirthdaysPage from "./pages/UpcomingBirthdaysPage";
import "./App.css";

type Page = "members" | "birthdays";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("members");

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="logo">
              <PartyPopper size={32} color="#FBBF24" strokeWidth={2} />
            </div>
            <div className="brand-text">
              <h1>Birthday Manager</h1>
              <p className="tagline">Never miss a celebration</p>
            </div>
          </div>
          <nav className="nav">
            <button
              className={currentPage === "members" ? "active" : ""}
              onClick={() => setCurrentPage("members")}
            >
              <span className="nav-icon">
                <Users size={18} />
              </span>
              Members
            </button>
            <button
              className={currentPage === "birthdays" ? "active" : ""}
              onClick={() => setCurrentPage("birthdays")}
            >
              <span className="nav-icon">
                <Cake size={18} />
              </span>
              Upcoming
            </button>
          </nav>
        </div>
      </header>
      <main className="main">
        {currentPage === "members" && <MembersPage />}
        {currentPage === "birthdays" && <UpcomingBirthdaysPage />}
      </main>
    </div>
  );
}

export default App;
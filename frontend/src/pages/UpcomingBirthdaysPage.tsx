import { useState, useEffect } from "react";
import type {MemberWithUpcomingBirthday} from "../types";
import { api } from "../services/api";
import BirthdayList from "../components/BirthdayList";

function UpcomingBirthdaysPage() {
  const [birthdays, setBirthdays] = useState<MemberWithUpcomingBirthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "30days">("all");

  const fetchBirthdays = async () => {
    try {
      setLoading(true);
      const data =
        filter === "30days"
          ? await api.getBirthdaysNext30Days()
          : await api.getUpcomingBirthdays();
      setBirthdays(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch birthdays");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirthdays();
  }, [filter]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Upcoming Birthdays</h2>
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All Upcoming
          </button>
          <button
            className={filter === "30days" ? "active" : ""}
            onClick={() => setFilter("30days")}
          >
            Next 30 Days
          </button>
        </div>
      </div>

      <BirthdayList birthdays={birthdays} />
    </div>
  );
}

export default UpcomingBirthdaysPage;

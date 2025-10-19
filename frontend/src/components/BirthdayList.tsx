import { useState } from "react";
import { Calendar, MapPin, Cake, PartyPopper, Clock } from "lucide-react";
import type {MemberWithUpcomingBirthday, AIMessageResponse} from "../types";
import { api } from "../services/api";

interface BirthdayListProps {
  birthdays: MemberWithUpcomingBirthday[];
}

function BirthdayList({ birthdays }: BirthdayListProps) {
  const [generatingFor, setGeneratingFor] = useState<number | null>(null);
  const [aiResponses, setAiResponses] = useState<Record<number, AIMessageResponse>>({});
  const [showExplainability, setShowExplainability] = useState<Record<number, boolean>>({});

  const handleGenerateMessage = async (
    memberId: number,
    tone: "friendly" | "formal",
    localize: boolean
  ) => {
    try {
      setGeneratingFor(memberId);
      setAiResponses(prev => {
        const updated = { ...prev };
        delete updated[memberId];
        return updated;
      });

      const response = await api.generateBirthdayMessage({
        member_id: memberId,
        tone,
        localize_language: localize,
      });

      setAiResponses(prev => ({
        ...prev,
        [memberId]: response
      }));
    } catch (err) {
      alert("Failed to generate message");
      console.error(err);
    } finally {
      setGeneratingFor(null);
    }
  };

  const toggleExplainability = (memberId: number) => {
    setShowExplainability(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  if (birthdays.length === 0) {
    return (
      <div className="empty-state">
        <p>No upcoming birthdays!</p>
      </div>
    );
  }

  return (
    <div className="birthday-list">
      {birthdays.map((member) => {
        const memberAiResponse = aiResponses[member.id];
        const isGenerating = generatingFor === member.id;
        const isExplainabilityVisible = showExplainability[member.id];

        return (
          <div key={member.id} className="birthday-card">
            <div className="birthday-info">
              <h3>
                {member.first_name} {member.last_name}
              </h3>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cake size={16} />
                Turning {member.age_turning} years old
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} />
                {new Date(member.birth_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="location-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} />
                {member.city}, {member.country}
              </div>
              <p className="days-until" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {member.days_until_birthday === 0 ? (
                  <>
                    <PartyPopper size={16} />
                    Birthday is TODAY!
                  </>
                ) : member.days_until_birthday === 1 ? (
                  <>
                    <PartyPopper size={16} />
                    Birthday is TOMORROW!
                  </>
                ) : (
                  <>
                    <Clock size={16} />
                    {member.days_until_birthday} days until birthday
                  </>
                )}
              </p>
            </div>

            <div className="ai-section">
              <div className="ai-buttons">
                <button
                  onClick={() => handleGenerateMessage(member.id, "friendly", false)}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Friendly Message"}
                </button>
                <button
                  onClick={() => handleGenerateMessage(member.id, "formal", false)}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Formal Message"}
                </button>
                <button
                  onClick={() => handleGenerateMessage(member.id, "friendly", true)}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Localized Message"}
                </button>
              </div>

              {isGenerating && (
                <p className="generating">Generating message for {member.first_name}...</p>
              )}

              {memberAiResponse && !isGenerating && (
                <div className="ai-result">
                  <div className="message-box">
                    <strong>Generated Message</strong>
                    <p>{memberAiResponse.message}</p>
                  </div>
                  <button
                    onClick={() => toggleExplainability(member.id)}
                    className="explainability-toggle"
                  >
                    {isExplainabilityVisible ? "Hide" : "Show"} Explainability
                  </button>
                  {isExplainabilityVisible && (
                    <div className="explainability">
                      <p>
                        <strong>Model:</strong> {memberAiResponse.explainability.model_name}
                      </p>
                      <p>
                        <strong>Parameters:</strong>{" "}
                        {JSON.stringify(memberAiResponse.explainability.key_parameters)}
                      </p>
                      <p>
                        <strong>Method:</strong>{" "}
                        {memberAiResponse.explainability.prompt_method}
                      </p>
                      <p>
                        <strong>Rationale:</strong>{" "}
                        {memberAiResponse.explainability.rationale}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BirthdayList;
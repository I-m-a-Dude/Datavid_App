import { Calendar, MapPin, Pencil } from "lucide-react";
import type {Member} from "../types";

interface MemberListProps {
  members: Member[];
  onDelete: (id: number) => void;
  onEdit: (member: Member) => void;
}

function MemberList({ members, onDelete, onEdit }: MemberListProps) {
  if (members.length === 0) {
    return (
      <div className="empty-state">
        <p>No members found. Add a member to get started!</p>
      </div>
    );
  }

  return (
    <div className="member-list">
      {members.map((member) => (
        <div key={member.id} className="member-card">
          <div className="member-info">
            <h3>
              {member.first_name} {member.last_name}
            </h3>
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
          </div>
          <div className="card-actions">
            <button
              onClick={() => onEdit(member)}
              className="edit-btn"
              aria-label={`Edit ${member.first_name} ${member.last_name}`}
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              onClick={() => onDelete(member.id)}
              className="delete-btn"
              aria-label={`Delete ${member.first_name} ${member.last_name}`}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MemberList;
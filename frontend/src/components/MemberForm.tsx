import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { MemberCreate, Member } from "../types";

interface MemberFormProps {
  onSubmit: (member: MemberCreate) => void;
  editingMember?: Member | null;
  onCancel?: () => void;
}

function MemberForm({ onSubmit, editingMember, onCancel }: MemberFormProps) {
  const [formData, setFormData] = useState<MemberCreate>({
    first_name: "",
    last_name: "",
    birth_date: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    if (editingMember) {
      setFormData({
        first_name: editingMember.first_name,
        last_name: editingMember.last_name,
        birth_date: editingMember.birth_date,
        country: editingMember.country,
        city: editingMember.city,
      });
    }
  }, [editingMember]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      first_name: "",
      last_name: "",
      birth_date: "",
      country: "",
      city: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="member-form">
      <div className="form-row">
        <input
          type="text"
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) =>
            setFormData({ ...formData, first_name: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) =>
            setFormData({ ...formData, last_name: e.target.value })
          }
          required
        />
      </div>

      <div className="form-row">
        <input
          type="date"
          value={formData.birth_date}
          onChange={(e) =>
            setFormData({ ...formData, birth_date: e.target.value })
          }
          required
        />
      </div>

      <div className="form-row">
        <input
          type="text"
          placeholder="Country"
          value={formData.country}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {editingMember ? "Update Member" : "Create Member"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default MemberForm;
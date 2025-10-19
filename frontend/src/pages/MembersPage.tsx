import { useState, useEffect } from "react";
import type {Member, MemberCreate} from "../types";
import { api } from "../services/api";
import MemberForm from "../components/MemberForm";
import MemberList from "../components/MemberList";

function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await api.getAllMembers();
      setMembers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch members");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleCreateOrUpdateMember = async (member: MemberCreate) => {
    try {
      if (editingMember) {
        // Update existing member
        await api.updateMember(editingMember.id, member);
      } else {
        // Create new member
        await api.createMember(member);
      }
      await fetchMembers();
      setShowForm(false);
      setEditingMember(null);
    } catch (err) {
      alert(editingMember ? "Failed to update member" : "Failed to create member");
      console.error(err);
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setShowForm(false);
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await api.deleteMember(id);
      await fetchMembers();
    } catch (err) {
      alert("Failed to delete member");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Members</h2>
        <button onClick={() => {
          setShowForm(!showForm);
          setEditingMember(null);
        }}>
          {showForm ? "Cancel" : "Add Member"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px' }}>
            {editingMember ? "Edit Member" : "Add New Member"}
          </h3>
          <MemberForm
            onSubmit={handleCreateOrUpdateMember}
            editingMember={editingMember}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      <MemberList
        members={members}
        onDelete={handleDeleteMember}
        onEdit={handleEditMember}
      />
    </div>
  );
}

export default MembersPage;
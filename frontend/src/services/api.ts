import type {
  Member,
  MemberCreate,
  MemberUpdate,
  MemberWithUpcomingBirthday,
  AIMessageRequest,
  AIMessageResponse,
} from "../types";

const API_BASE_URL = "http://127.0.0.1:8000";

export const api = {
  // Member CRUD
  createMember: async (member: MemberCreate): Promise<Member> => {
    const response = await fetch(`${API_BASE_URL}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    if (!response.ok) throw new Error("Failed to create member");
    return response.json();
  },

  getAllMembers: async (): Promise<Member[]> => {
    const response = await fetch(`${API_BASE_URL}/members`);
    if (!response.ok) throw new Error("Failed to fetch members");
    return response.json();
  },

  getMember: async (id: number): Promise<Member> => {
    const response = await fetch(`${API_BASE_URL}/members/${id}`);
    if (!response.ok) throw new Error("Failed to fetch member");
    return response.json();
  },

  updateMember: async (id: number, member: MemberUpdate): Promise<Member> => {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    if (!response.ok) throw new Error("Failed to update member");
    return response.json();
  },

  deleteMember: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete member");
  },

  // Birthday views
  getUpcomingBirthdays: async (): Promise<MemberWithUpcomingBirthday[]> => {
    const response = await fetch(`${API_BASE_URL}/members/birthdays/upcoming`);
    if (!response.ok) throw new Error("Failed to fetch upcoming birthdays");
    return response.json();
  },

  getBirthdaysNext30Days: async (): Promise<MemberWithUpcomingBirthday[]> => {
    const response = await fetch(`${API_BASE_URL}/members/birthdays/next-30-days`);
    if (!response.ok) throw new Error("Failed to fetch birthdays next 30 days");
    return response.json();
  },

  // AI birthday message
  generateBirthdayMessage: async (
    request: AIMessageRequest
  ): Promise<AIMessageResponse> => {
    const response = await fetch(`${API_BASE_URL}/ai/birthday-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Failed to generate birthday message");
    return response.json();
  },
};
